#!/usr/bin/env node

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h") || args.length === 0) {
  console.log(`
Tip Calculator

Usage: node tipcalc.js <bill> [tipPercent] [people]

Arguments:
  bill        Total bill amount (required)
  tipPercent  Tip percentage (default: 18)
  people      Number of people splitting the bill (default: 1)

Example:
  node tipcalc.js 84.50 20 3
`);
  process.exit(0);
}

const bill = Number(args[0]);
const tipPercent = Number(args[1] ?? process.env.TIP_PERCENT ?? 18);
const people = Number(args[2] ?? 1);

if (!Number.isFinite(bill) || bill <= 0) {
  console.error("Error: Bill must be a positive number.");
  process.exit(1);
}

if (!Number.isFinite(tipPercent) || tipPercent < 0 || tipPercent > 100) {
  console.error("Error: Tip percentage must be between 0 and 100.");
  process.exit(1);
}

if (!Number.isInteger(people) || people <= 0) {
  console.error("Error: People must be a positive whole number.");
  process.exit(1);
}

const tip = bill * tipPercent / 100;
const total = bill + tip;
const perPerson = total / people;

console.log(`Bill: $${bill.toFixed(2)}`);
console.log(`Tip (${tipPercent}%): $${tip.toFixed(2)}`);
console.log(`Total: $${total.toFixed(2)}`);
console.log(`Per person: $${perPerson.toFixed(2)}`);
