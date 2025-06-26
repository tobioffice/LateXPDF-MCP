#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read package.json to get the current version
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// Update the version in index.ts
const indexTsPath = path.join(__dirname, '..', 'index.ts');
const indexTs = fs.readFileSync(indexTsPath, 'utf8');

// Replace the version string in index.ts
const updatedIndexTs = indexTs.replace(
  /const packageVersion = "[\d\.]+";/,
  `const packageVersion = "${version}";`
);

fs.writeFileSync(indexTsPath, updatedIndexTs);

console.log(`Updated version in index.ts to ${version}`);
