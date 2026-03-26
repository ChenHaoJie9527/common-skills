#!/usr/bin/env node

const items = [
  "All tests pass",
  "Race detector checked for key packages",
  "Structured logging is enabled",
  "Health, readiness, or liveness endpoint exists",
  "Graceful shutdown is implemented",
  "Request timeout strategy is defined",
  "Database connection pool is configured",
  "Input validation exists on external-facing endpoints",
  "Sensitive internal errors are not returned to clients",
  "Rate limiting or abuse protection is considered",
];

console.log("# Go Backend Production Checklist\n");
for (const item of items) {
  console.log(`- [ ] ${item}`);
}
