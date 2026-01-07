#!/usr/bin/env node
import { Establishment, PurchaseGenerator } from "./purchase-generator.js";
import { TriggerPlanner } from "./trigger-planner.js";

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = { runs: 1, businesses: [] };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--runs" && args[i + 1]) {
      options.runs = Number(args[i + 1]) || 1;
      i += 1;
      continue;
    }
    if (arg === "--business" && args[i + 1]) {
      options.businesses.push(args[i + 1]);
      i += 1;
      continue;
    }
  }
  return options;
};

const BUSINESS_MAP = {
  ROCK_BOTTOM: Establishment.ROCK_BOTTOM,
  SCOTTISH_DIESEL: Establishment.SCOTTISH_DIESEL,
  GET_NAKED: Establishment.GET_NAKED,
  LA_MORDIDA: Establishment.LA_MORDIDA,
};

const resolveBusinesses = (requested) => {
  if (!requested.length) return Object.values(BUSINESS_MAP);
  return requested
    .map((name) => name.toUpperCase())
    .map((name) => BUSINESS_MAP[name])
    .filter(Boolean);
};

const formatMoney = (value) => value.toFixed(2);

const summarizeOrders = (orders) => {
  const summary = {
    orderCount: 0,
    itemCount: 0,
    totalGross: 0,
    byItem: new Map(),
  };

  for (const order of orders) {
    summary.orderCount += 1;
    for (const item of order.items || []) {
      summary.itemCount += item.quantity;
      summary.totalGross += item.totalGrossPrice || 0;
      const key = item.name;
      const existing = summary.byItem.get(key) || { quantity: 0, total: 0 };
      existing.quantity += item.quantity;
      existing.total += item.totalGrossPrice || 0;
      summary.byItem.set(key, existing);
    }
  }

  return summary;
};

const printSummary = (label, summary) => {
  console.log(`\n${label}`);
  console.log(`Orders: ${summary.orderCount}`);
  console.log(`Items: ${summary.itemCount}`);
  console.log(`Gross: GBP ${formatMoney(summary.totalGross)}`);

  const top = Array.from(summary.byItem.entries())
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10);
  if (top.length) {
    console.log("Top items:");
    for (const [name, data] of top) {
      console.log(
        `- ${name}: ${data.quantity} units, GBP ${formatMoney(data.total)}`
      );
    }
  }
};

const main = () => {
  const options = parseArgs();
  const planner = new TriggerPlanner();
  const businesses = resolveBusinesses(options.businesses);
  const aggregate = new Map();

  for (let run = 0; run < options.runs; run += 1) {
    const plan = planner.getPlan(new Date());
    for (const business of businesses) {
      const count = plan[business] ?? 0;
      if (count <= 0) continue;
      const generator = new PurchaseGenerator(business);
      const orders = [];
      for (let i = 0; i < count; i += 1) {
        const payload = generator.generateOrders();
        orders.push(...payload.orders);
      }
      const current = aggregate.get(business) || [];
      current.push(...orders);
      aggregate.set(business, current);
    }
  }

  for (const business of businesses) {
    const orders = aggregate.get(business) || [];
    const summary = summarizeOrders(orders);
    printSummary(business, summary);
  }
};

main();
