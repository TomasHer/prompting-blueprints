/* Prompting Blueprints — GitHub-backed static web viewer
 * Works as a purely static site (open index.html). Requires internet access to GitHub to fetch file tree & content.
 */

const CFG = {
  owner: "TomasHer",
  repo: "prompting-blueprints",
  branch: "main",
  maxSearchResults: 25,
  treeCacheTtlMs: 1000 * 60 * 60 * 6, // 6 hours
  fileCacheTtlMs: 1000 * 60 * 60 * 12, // 12 hours
  excludeDirs: [".vscode", "website"],
  searchExcludeDirs: ["assets"],
  excludeFiles: ["docs/app.js", "docs/index.html", "docs/styles.css", "agents.md"]
};

const els = {
  statusPill: document.getElementById("statusPill"),
  tree: document.getElementById("tree"),
  viewer: document.getElementById("viewer"),
  breadcrumbs: document.getElementById("breadcrumbs"),
  viewOnGithub: document.getElementById("viewOnGithub"),
  rawLink: document.getElementById("rawLink"),
  searchInput: document.getElementById("searchInput"),
  searchResults: document.getElementById("searchResults"),
  //refreshBtn: document.getElementById("refreshBtn"),
  
  // NEW
  menuBtn: document.getElementById("menuToggle"),
  sidebar: document.querySelector(".sidebar"),
  overlay: document.getElementById("mobileOverlay")
};

let currentPath = null;
const DEFAULT_VIEW_HTML = els.viewer.innerHTML;

const API_BASE = () => `https://api.github.com/repos/${CFG.owner}/${CFG.repo}`;
const RAW_BASE = () => `https://raw.githubusercontent.com/${CFG.owner}/${CFG.repo}/${CFG.branch}/`;

function nowMs(){ return Date.now(); }

function setPill(kind, text){
  els.statusPill.className = `pill ${kind || ""}`.trim();
  els.statusPill.textContent = text;
}

function cacheGet(key){
  try{
    const raw = localStorage.getItem(key);
    if(!raw) return null;
    return JSON.parse(raw);
  }catch(_){ return null; }
}
function cacheSet(key, value){
  try{ localStorage.setItem(key, JSON.stringify(value)); }catch(_){}
}
function cacheDel(key){
  try{ localStorage.removeItem(key); }catch(_){}
}

function escapeHtml(s){
  return s
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function extOf(path){
  const i = path.lastIndexOf(".");
  if(i === -1) return "";
  return path.slice(i+1).toLowerCase();
}

function dirname(path){
  const i = path.lastIndexOf("/");
  return i === -1 ? "" : path.slice(0, i+1);
}

function shouldExcludePath(path){
  const parts = path.split("/");
  const base = parts[parts.length - 1];
  if (parts.some((part) => CFG.excludeDirs.includes(part))) return true;
  if (CFG.excludeFiles.includes(path)) return true;
  if (CFG.excludeFiles.includes(base)) return true;
  return false;
}

function shouldExcludeSearchPath(path){
  if(!Array.isArray(CFG.searchExcludeDirs) || CFG.searchExcludeDirs.length === 0) return false;
  const parts = path.split("/");
  return parts.some((part) => CFG.searchExcludeDirs.includes(part));
}

/** Resolve a relative link (as in markdown) against a base file path inside repo. */
function resolveRepoPath(baseFilePath, relativeHref){
  // strip query for path resolution; keep fragment for later
  const fragIndex = relativeHref.indexOf("#");
  const qIndex = relativeHref.indexOf("?");
  const cutIndex = (fragIndex === -1) ? qIndex : (qIndex === -1 ? fragIndex : Math.min(fragIndex, qIndex));
  const pathPart = (cutIndex === -1) ? relativeHref : relativeHref.slice(0, cutIndex);
  const suffix = (cutIndex === -1) ? "" : relativeHref.slice(cutIndex);

  // Already absolute-ish (scheme, //, /)
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(relativeHref)) return { path: null, suffix };
  if (relativeHref.startsWith("//")) return { path: null, suffix };
  if (relativeHref.startsWith("/")) return { path: relativeHref.replace(/^\//,""), suffix };

  // Normalize . and .. using URL
  const baseDir = dirname(baseFilePath);
  const u = new URL(pathPart, "https://example.com/" + baseDir);
  const resolved = u.pathname.replace(/^\//,"");
  return { path: resolved, suffix };
}

function parseHash(){
  const h = window.location.hash || "";
  // #path=foo/bar.md
  const m = h.match(/path=([^&]+)/);
  if(!m) return null;
  try{ return decodeURIComponent(m[1]); }catch(_){ return m[1]; }
}

function setHashPath(path){
  const enc = encodeURIComponent(path);
  const nextHash = `#path=${enc}`;
  if(window.location.hash === nextHash) return false;
  window.location.hash = `path=${enc}`;
  return true;
}

function buildTreeModel(paths){
  const root = { name: "", path: "", type: "tree", children: new Map() };

  for(const p of paths){
    const parts = p.split("/");
    let node = root;
    let soFar = "";
    for(let i=0; i<parts.length; i++){
      const part = parts[i];
      soFar = soFar ? (soFar + "/" + part) : part;
      const isLeaf = (i === parts.length - 1);
      if(!node.children.has(part)){
        node.children.set(part, {
          name: part,
          path: soFar,
          type: isLeaf ? "blob" : "tree",
          children: new Map()
        });
      }
      node = node.children.get(part);
      if(isLeaf) node.type = "blob";
    }
  }
  return root;
}

function sortChildren(map){
  const arr = Array.from(map.values());
  arr.sort((a,b) => {
    if(a.type !== b.type) return a.type === "tree" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return arr;
}

function iconFor(node){
  if(node.type === "tree") return "▸";
  const e = extOf(node.path);
  if(e === "md") return "M";
  if(["png","jpg","jpeg","gif","svg","webp"].includes(e)) return "🖼";
  if(e === "pdf") return "PDF";
  if(["yml","yaml","json","toml","xml","ini","env","txt","log","csv"].includes(e)) return "{}";
  if(["js","ts","css","html","py","java","go","rs","cpp","c","sh","ps1","sql"].includes(e)) return "<>";
  return "•";
}

function renderTree(root){
  els.tree.innerHTML = "";
  const activeEls = new Map(); // path -> element

  function makeNodeEl(node, depth){
    const row = document.createElement("div");
    row.className = "node";
    row.setAttribute("role", "treeitem");
    row.dataset.path = node.path;

    const icon = document.createElement("div");
    icon.className = "icon";
    icon.textContent = iconFor(node);
    row.appendChild(icon);

    const label = document.createElement("div");
    label.className = "label";
    label.textContent = node.name;
    row.appendChild(label);

    if(node.type === "blob"){
      const badge = document.createElement("div");
      badge.className = "badge";
      badge.textContent = extOf(node.path) ? `.${extOf(node.path)}` : "";
      row.appendChild(badge);
    }

    const childrenWrap = document.createElement("div");
    childrenWrap.className = "children";

    row.addEventListener("click", async (ev) => {
      ev.stopPropagation();
      if(node.type === "tree"){
        childrenWrap.classList.toggle("open");
        icon.textContent = childrenWrap.classList.contains("open") ? "▾" : "▸";
      }else{
        await loadFile(node.path, {scrollToTop:true});
      }
    });

    activeEls.set(node.path, row);

    const container = document.createElement("div");
    container.appendChild(row);
    container.appendChild(childrenWrap);

    if(node.type === "tree"){
      const kids = sortChildren(node.children);
      for(const k of kids){
        childrenWrap.appendChild(makeNodeEl(k, depth+1));
      }
      // Do not auto-open by default; open later when selecting a file
    }

    return container;
  }

  const topKids = sortChildren(root.children);
  for(const k of topKids){
    els.tree.appendChild(makeNodeEl(k, 0));
  }

  return {
    setActive(path){
      // clear old
      for(const el of activeEls.values()) el.classList.remove("active");

      const el = activeEls.get(path);
      if(el){
        el.classList.add("active");

        // expand parent folders
        const parts = path.split("/");
        let cur = "";
        for(let i=0; i<parts.length-1; i++){
          cur = cur ? (cur + "/" + parts[i]) : parts[i];
          const parentEl = activeEls.get(cur);
          if(parentEl){
            const parentContainer = parentEl.parentElement; // the wrapper
            const childrenWrap = parentContainer.querySelector(":scope > .children");
            const icon = parentContainer.querySelector(":scope > .node > .icon");
            if(childrenWrap && !childrenWrap.classList.contains("open")){
              childrenWrap.classList.add("open");
              if(icon) icon.textContent = "▾";
            }
          }
        }

        // scroll into view
        el.scrollIntoView({block:"nearest"});
      }
    },
    clearActive(){
      for(const el of activeEls.values()) el.classList.remove("active");
    }
  };
}

async function fetchJson(url){
  const res = await fetch(url, { headers: { "Accept":"application/vnd.github+json" }});
  if(!res.ok){
    const t = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${t.slice(0,160)}`);
  }
  return await res.json();
}

async function fetchText(url){
  const res = await fetch(url);
  if(!res.ok){
    const t = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${t.slice(0,160)}`);
  }
  return await res.text();
}

async function getRepoTree(){
  const cacheKey = `pb_tree_${CFG.owner}_${CFG.repo}_${CFG.branch}`;
  const cached = cacheGet(cacheKey);
  if(cached && cached.ts && (nowMs() - cached.ts) < CFG.treeCacheTtlMs && Array.isArray(cached.paths)){
    setPill("ok", "Tree cached");
    return { paths: cached.paths, cached: true };
  }

  setPill("", "Fetching tree…");
  // Primary strategy: trees API directly on branch name (works on GitHub)
  try{
    const data = await fetchJson(`${API_BASE()}/git/trees/${CFG.branch}?recursive=1`);
    const paths = (data.tree || [])
      .filter(x => x.type === "blob")
      .map(x => x.path)
      .filter(Boolean);
    cacheSet(cacheKey, { ts: nowMs(), paths });
    setPill("ok", `Loaded ${paths.length} files`);
    return { paths, cached:false };
  }catch(err){
    // Fallback: discover default branch & SHA
    try{
      const repo = await fetchJson(`${API_BASE()}`);
      const branch = repo.default_branch || CFG.branch;
      CFG.branch = branch;
      const ref = await fetchJson(`${API_BASE()}/git/refs/heads/${branch}`);
      const sha = ref?.object?.sha;
      if(!sha) throw err;
      const data2 = await fetchJson(`${API_BASE()}/git/trees/${sha}?recursive=1`);
      const paths2 = (data2.tree || [])
        .filter(x => x.type === "blob")
        .map(x => x.path)
        .filter(Boolean);
      cacheSet(cacheKey, { ts: nowMs(), paths: paths2 });
      setPill("ok", `Loaded ${paths2.length} files`);
      return { paths: paths2, cached:false };
    }catch(_){
      setPill("bad", "Tree load failed");
      throw err;
    }
  }
}

function makeFileMetaChips(path){
  const e = extOf(path);
  const chips = [];
  chips.push(`<span class="chip">Path: <code>${escapeHtml(path)}</code></span>`);
  if(e) chips.push(`<span class="chip">Type: <code>.${escapeHtml(e)}</code></span>`);
  chips.push(`<span class="chip">Branch: <code>${escapeHtml(CFG.branch)}</code></span>`);
  return `<div class="file-meta">${chips.join("")}</div>`;
}

function updateHeaderLinks(path){
  const githubUrl = `https://github.com/${CFG.owner}/${CFG.repo}/blob/${CFG.branch}/${path}`;
  const rawUrl = `${RAW_BASE()}${encodeURI(path)}`;
  els.viewOnGithub.href = githubUrl;
  els.rawLink.href = rawUrl;
}

function resetHeaderLinks(){
  els.viewOnGithub.href = "#";
  els.rawLink.href = "#";
}

function updateBreadcrumbs(path){
  els.breadcrumbs.textContent = path || "";
}

function isBinaryView(ext){
  return ["pdf","png","jpg","jpeg","gif","svg","webp","mp4","mov","webm"].includes(ext);
}

function setViewerHtml(html){
  els.viewer.innerHTML = html;
}

function showEmptyState(){
  currentPath = null;
  setViewerHtml(DEFAULT_VIEW_HTML);
  updateBreadcrumbs("");
  resetHeaderLinks();
  els.viewer.scrollTop = 0;
}

function enhanceCodeBlocks(){
  // highlight.js: highlight all pre code blocks
  if(window.hljs){
    els.viewer.querySelectorAll("pre code").forEach((el) => {
      try{ window.hljs.highlightElement(el); }catch(_){}
    });
  }
}

function rewriteMarkdownLinks(basePath){
  // images
  els.viewer.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src") || "";
    if(!src) return;
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(src) || src.startsWith("//")) return;
    const resolved = resolveRepoPath(basePath, src);
    if(resolved.path){
      img.src = `${RAW_BASE()}${encodeURI(resolved.path)}`;
    }
  });

  // anchors
  els.viewer.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if(!href) return;

    // Leave external links as-is
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(href) || href.startsWith("//")) {
      a.target = "_blank";
      a.rel = "noreferrer";
      return;
    }

    // Intra-page fragments
    if(href.startsWith("#")) return;

    const resolved = resolveRepoPath(basePath, href);
    if(!resolved.path) return;

    // If link points to a directory, do nothing
    // For files: route internally
    a.href = "javascript:void(0)";
    a.addEventListener("click", async (ev) => {
      ev.preventDefault();
      await loadFile(resolved.path, {scrollToTop:true, fragment: resolved.suffix.startsWith("#") ? resolved.suffix.slice(1) : null});
    });
  });
}

function scrollToFragment(fragmentId){
  if(!fragmentId) return;
  const el = document.getElementById(fragmentId);
  if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
}

async function loadFile(path, opts = {}){
  currentPath = path;
  const e = extOf(path);
  updateBreadcrumbs(path);
  updateHeaderLinks(path);
  if(opts.setActive) opts.setActive(path);
  if(opts.updateHash !== false) setHashPath(path);

  const cacheKey = `pb_file_${CFG.owner}_${CFG.repo}_${CFG.branch}_${path}`;
  const cached = cacheGet(cacheKey);
  const stillFresh = cached && cached.ts && (nowMs() - cached.ts) < CFG.fileCacheTtlMs;

  const rawUrl = `${RAW_BASE()}${encodeURI(path)}`;
  const githubUrl = `https://github.com/${CFG.owner}/${CFG.repo}/blob/${CFG.branch}/${path}`;

  // Binary / embed types
  if(e === "pdf"){
    setViewerHtml(`
      ${makeFileMetaChips(path)}
      <div class="notice"><strong>PDF preview:</strong> if it does not render, use “Raw” to open it directly.</div>
      <div class="iframe-wrap" style="margin-top:12px;">
        <iframe src="${rawUrl}" title="${escapeHtml(path)}"></iframe>
      </div>
    `);
    return;
  }
  if(["png","jpg","jpeg","gif","svg","webp"].includes(e)){
    setViewerHtml(`
      ${makeFileMetaChips(path)}
      <div class="notice"><strong>Image file.</strong> Click “Raw” to open/download.</div>
      <p><img src="${rawUrl}" alt="${escapeHtml(path)}" /></p>
    `);
    return;
  }
  if(e === "html" || e === "htm"){
    setViewerHtml(`
      ${makeFileMetaChips(path)}
      <div class="notice"><strong>HTML preview:</strong> content is sandboxed in an iframe.</div>
      <div class="iframe-wrap" style="margin-top:12px;">
        <iframe src="${rawUrl}" title="${escapeHtml(path)}" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
      </div>
    `);
    return;
  }

  // Text types
  try{
    setPill("", "Loading file…");
    let text;
    if(stillFresh && typeof cached.text === "string"){
      text = cached.text;
      setPill("ok", "File cached");
    }else{
      text = await fetchText(rawUrl);
      cacheSet(cacheKey, { ts: nowMs(), text });
      setPill("ok", "Loaded");
    }

    if(e === "md" && window.marked){
      // Marked configuration with code highlighting
      window.marked.setOptions({
        gfm: true,
        breaks: false,
        headerIds: true,
        mangle: false,
        highlight: function(code, lang){
          try{
            if(window.hljs){
              if(lang && window.hljs.getLanguage(lang)){
                return window.hljs.highlight(code, {language: lang}).value;
              }
              return window.hljs.highlightAuto(code).value;
            }
          }catch(_){}
          return escapeHtml(code);
        }
      });

      const html = window.marked.parse(text);
      setViewerHtml(`${makeFileMetaChips(path)}<div class="md">${html}</div>`);
      rewriteMarkdownLinks(path);
      enhanceCodeBlocks();

      if(opts.scrollToTop) els.viewer.scrollTop = 0;
      if(opts.fragment) setTimeout(() => scrollToFragment(opts.fragment), 0);
      setPill("ok", "Rendered");
      return;
    }

    // Fallback: show as code/text
    const lang = (e || "").toLowerCase();
    setViewerHtml(`
      ${makeFileMetaChips(path)}
      <pre><code class="language-${escapeHtml(lang)}">${escapeHtml(text)}</code></pre>
      <div class="notice" style="margin-top:12px;">
        <strong>Tip:</strong> Use “View on GitHub” for rich rendering of special file types.
      </div>
    `);
    enhanceCodeBlocks();
    if(opts.scrollToTop) els.viewer.scrollTop = 0;
    setPill("ok", "Displayed");
  }catch(err){
    setPill("bad", "Load failed");
    setViewerHtml(`
      ${makeFileMetaChips(path)}
      <div class="notice">
        <strong>Could not load file.</strong><br/>
        ${escapeHtml(String(err.message || err))}
        <div style="margin-top:10px;">
          <a class="btn secondary" target="_blank" rel="noreferrer" href="${githubUrl}">Open on GitHub</a>
        </div>
      </div>
    `);
  }
}

function setupSearch(filePaths, onPick){
  const pathsLower = filePaths.map(p => ({ p, k: p.toLowerCase() }));

  function closeResults(){
    els.searchResults.style.display = "none";
    els.searchResults.innerHTML = "";
  }

  function openResults(items){
    els.searchResults.innerHTML = "";
    for(const it of items){
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `<div class="name">${escapeHtml(it.p.split("/").slice(-1)[0])}</div>
                       <div class="path">${escapeHtml(it.p)}</div>`;
      div.addEventListener("click", async () => {
        closeResults();
        els.searchInput.value = "";
        await onPick(it.p);
      });
      els.searchResults.appendChild(div);
    }
    els.searchResults.style.display = items.length ? "block" : "none";
  }

  els.searchInput.addEventListener("input", () => {
    const q = (els.searchInput.value || "").trim().toLowerCase();
    if(!q){ closeResults(); return; }

    const tokens = q.split(/\s+/).filter(Boolean);
    const scored = [];
    for(const it of pathsLower){
      let score = 0;
      for(const t of tokens){
        const idx = it.k.indexOf(t);
        if(idx === -1){ score = -1; break; }
        score += (idx === 0 ? 3 : 1);
      }
      if(score >= 0) scored.push({ p: it.p, score });
    }
    scored.sort((a,b) => b.score - a.score || a.p.localeCompare(b.p));
    openResults(scored.slice(0, CFG.maxSearchResults));
  });

  document.addEventListener("click", (ev) => {
    if(!els.searchResults.contains(ev.target) && ev.target !== els.searchInput) closeResults();
  });

  document.addEventListener("keydown", (ev) => {
    const isMac = navigator.platform.toLowerCase().includes("mac");
    if((isMac ? ev.metaKey : ev.ctrlKey) && ev.key.toLowerCase() === "k"){
      ev.preventDefault();
      els.searchInput.focus();
    }
    if(ev.key === "Escape") closeResults();
  });
}

async function init(){
  try{
    setPill("", "Initializing…");

    const { paths } = await getRepoTree();
    const filteredPaths = paths.filter((p) => !shouldExcludePath(p));
    const searchPaths = filteredPaths.filter((p) => !shouldExcludeSearchPath(p));

    const model = buildTreeModel(filteredPaths);

    const treeApi = renderTree(model);

    setupSearch(searchPaths, async (p) => loadFile(p, {scrollToTop:true, setActive: treeApi.setActive}));

    // Refresh
    /*els.refreshBtn.addEventListener("click", async () => {
      const cacheKey = `pb_tree_${CFG.owner}_${CFG.repo}_${CFG.branch}`;
      cacheDel(cacheKey);
      window.location.reload();
    });*/

    // NEW: Mobile Menu Logic
    function toggleMenu(forceState) {
      if(!els.sidebar || !els.overlay) return;
      const isOpen = els.sidebar.classList.contains("open");
      const nextState = forceState !== undefined ? forceState : !isOpen;
      
      if (nextState) {
        els.sidebar.classList.add("open");
        els.overlay.classList.add("open");
      } else {
        els.sidebar.classList.remove("open");
        els.overlay.classList.remove("open");
      }
    }

    if(els.menuBtn) els.menuBtn.addEventListener("click", () => toggleMenu());
    if(els.overlay) els.overlay.addEventListener("click", () => toggleMenu(false));
    
    // Auto-close menu when clicking a file (leaf node) in the tree
    if(els.tree){
      els.tree.addEventListener("click", (e) => {
        const nodeEl = e.target.closest(".node");
        // check if it is a leaf (no children sibling)
        if(nodeEl && !nodeEl.nextElementSibling?.classList.contains("children")){
           if (window.innerWidth <= 980) {
              toggleMenu(false);
           }
        }
      });
    }

    const readme = filteredPaths.find(p => p.toLowerCase() === "readme.md") || null;

    async function syncFromHash(source){
      const target = parseHash();
      if(target && filteredPaths.includes(target)){
        if(target === currentPath) return;
        await loadFile(target, {scrollToTop:true, setActive: treeApi.setActive, updateHash:false});
        treeApi.setActive(target);
        return;
      }

      if(readme){
        if(readme === currentPath) return;
        const shouldUpdateHash = source === "init";
        const shouldScrollTop = source !== "init";
        await loadFile(readme, {scrollToTop: shouldScrollTop, setActive: treeApi.setActive, updateHash: shouldUpdateHash});
        treeApi.setActive(readme);
      }else{
        treeApi.clearActive();
        showEmptyState();
        setPill("ok", `Loaded ${filteredPaths.length} files`);
      }
    }

    window.addEventListener("hashchange", () => {
      syncFromHash("hashchange");
    });

    await syncFromHash("init");
  }catch(err){
    setPill("bad", "Init failed");
    els.viewer.innerHTML = `
      <div class="notice">
        <strong>Initialization failed.</strong><br/>
        ${escapeHtml(String(err.message || err))}
        <div style="margin-top:10px;">
          Check connectivity to GitHub and refresh.
        </div>
      </div>
    `;
  }
}

init();