# Reasoning-LLMs vs. klassische GPT-Modelle

## Zweck
Zeigt Prompt-Ingenieur:innen auf Deutsch, wann sie planende Reasoning-Modelle (z. B. OpenAI o3, DeepSeek R1, GPT-5) einsetzen sollten und wann klassische Output-orientierte Modelle (z. B. GPT-4o, Claude 3.5 Sonnet) besser passen – inklusive unterschiedlicher Prompting-Strategien.

## Schnellvergleich
| Dimension | Reasoning-LLMs ("der Planer") | Klassische GPT-LLMs ("das Arbeitspferd") |
| --- | --- | --- |
| Geeignete Aufgaben | Mehrstufige Planung, Dokument-Zusammenführung, Beziehungsanalyse, Logik & Mathematik | Q&A, Zusammenfassungen, Übersetzungen, redaktionelle Aufgaben |
| Stärken | Eigenständiges mehrstufiges Denken, Einsicht in Gedankengänge, robust bei Unklarheiten | Hohe Geschwindigkeit, niedrige Latenz, geringere Kosten, verlässliche Formatierung |
| Prompt-Struktur | Wenig Gerüst: Ziel und Rahmen liefern, Modell entscheidet über Schritte/Werkzeuge | Detaillierte Struktur mit Abschnitten, Listen oder XML/JSON, Schritt-für-Schritt-Anweisungen |
| Rollenbeschreibung | Keine engen Rollen setzen; Mission und Erfolgskriterien genügen | Klare Rollen („Du bist…“) definieren, um Ton und Output auszurichten |
| Output-Kontrolle | Reasoning-Protokoll getrennt vom finalen Ergebnis anfordern, Formatierung ans Ende stellen | Ausgabeformat exakt vorgeben (Überschriften, Stichpunkte, Tabellen, Länge, Tonalität) |
| Kontext | Hintergrund, Ziel und Erfolgsmessung nennen – Modell plant selbstständig | Kontext schlank halten, nur relevante Fakten für die Antwort mitgeben |

## Reasoning-Modelle prompten
- **Ziele formulieren, keine Skripte.** Beschreibe Mission, Constraints und gewünschtes Ergebnis; überlasse Planung und Werkzeugwahl dem Modell.
- **Zwischengedanken sichtbar machen.** Bitte um ein "Gedankenprotokoll" oder eine Reflexionsphase vor dem finalen Ergebnis.
- **Selbstkontrolle erlauben.** Fordere explizit auf, den Plan zu prüfen und bei Bedarf zu überarbeiten.
- **Weniger starre Tags.** Zu viele XML- oder Sektionstags unterbrechen den Planungsmodus.
- **Ideal für Multi-Hop-Aufgaben.** Nutze sie für komplexe Recherchen, Analysen, mathematische Herleitungen und orchestrierte Workflows.

## Klassische GPT-Modelle prompten
- **Präzise Anweisungen geben.** Rolle, Publikum, Ton und gewünschte Struktur früh festlegen.
- **Struktur vorgeben.** Mit Überschriften, Tabellen oder JSON-Schemata klare Leitplanken setzen.
- **Einmal-Antwort erwarten.** Modelle liefern direkt das Ergebnis; packe alle relevanten Infos in die Eingabe.
- **Auf Geschwindigkeit optimieren.** Kurze Prompts und knapper Kontext reduzieren Latenz und Kosten.
- **Perfekt für skalierbare Templates.** Geeignet für Support-Antworten, Marketing-Texte, Übersetzungen und Zusammenfassungen.

## Entscheidungs-Checkliste
1. **Mehrdeutig oder mehrschrittig?** → Reasoning-Modell wählen.
2. **Braucht es reproduzierbare Formate?** → Klassisches Modell bevorzugen.
3. **Soll der Denkweg sichtbar sein?** → Reasoning-Modell kann sein Vorgehen offenlegen.
4. **Ist Budget/Latenz kritisch?** → Klassische Modelle sind meist günstiger und schneller.

## Prompt-Beispiele
- **Reasoning-Modell**
  ```text
  Ziel: Erstelle einen Maßnahmenplan für die fünf kritischsten Risiken im Audit.
  Kontext: [Stichpunkte mit Risikozusammenfassung]
  Anweisungen: Denke Schritt für Schritt, priorisiere nach Business Impact, schlage Verantwortliche und nächste Schritte vor. Liefere zuerst ein Planungsprotokoll, dann den finalen Plan.
  ```
- **Klassisches Modell**
  ```text
  Du bist IT-Compliance-Analyst:in. Formuliere eine E-Mail mit Maßnahmenübersicht zu den fünf kritischsten Risiken.
  Ausgabeformat:
  - Begrüßung
  - Tabelle mit Spalten: Risiko, Impact, Owner, Next Step
  - Abschlusssatz mit Terminhinweis
  Verwende einen professionellen, zugänglichen Ton.
  ```

## Weiterführende Ressourcen
- [Reasoning-Scaffold-Pattern](../patterns/reasoning-scaffold.md)
- [Blueprint für strukturierte Outputs](../patterns/structured-output-blueprint.md)
