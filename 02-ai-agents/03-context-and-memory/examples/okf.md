---
type: BigQuery Table
title: Orders
description: One row per completed customer order.
resource: https://console.cloud.google.com/bigquery?p=acme&d=sales&t=orders
tags: [sales, revenue]
timestamp: 2026-05-28T14:30:00Z
---

# Overview

The `orders` table is the source of truth for completed customer purchases.
Each row represents one order that reached the `completed` state. Use it for
revenue reporting, cohort analysis, and order-level joins.

# Schema

| Column         | Type      | Description                                        |
|----------------|-----------|----------------------------------------------------|
| `order_id`     | STRING    | Globally unique order identifier.                  |
| `customer_id`  | STRING    | FK to [customers](/tables/customers.md).           |
| `status`       | STRING    | Order state. This table only contains `completed`. |
| `total_amount` | NUMERIC   | Order total in USD, tax included.                  |
| `created_at`   | TIMESTAMP | When the order was placed (UTC).                   |

# Joins

Joined with [customers](/tables/customers.md) on `customer_id`.

# Notes

- Refreshed hourly from the production replica.
- Refunds are tracked separately in [refunds](/tables/refunds.md), not here.
- For the revenue metric definition, see
  [weekly active revenue](/metrics/weekly_active_users.md).
