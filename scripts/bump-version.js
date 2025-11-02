#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const bumpType = process.argv[2] || 'patch';
const packagesDir = path.join(__dirname, '..', 'packages');

function incrementVersion(version, type) {
  const parts = version.split('.').map(Number);
  switch (type) {
    case 'major':
      return `${parts[0] + 1}.0.0`;
    case 'minor':
      return `${parts[0]}.${parts[1] + 1}.0`;
    case 'patch':
    default:
      return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
  }
}

function updatePackageVersion(packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    return null;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Skip example and docs packages
  if (packageJson.name === 'example' || packageJson.name === 'kstyled-docs') {
    return null;
  }

  const oldVersion = packageJson.version;
  const newVersion = incrementVersion(oldVersion, bumpType);

  packageJson.version = newVersion;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');

  console.log(`${packageJson.name}: ${oldVersion} -> ${newVersion}`);

  return { name: packageJson.name, oldVersion, newVersion };
}

// Get all packages
const packages = fs.readdirSync(packagesDir).filter(name => {
  const packagePath = path.join(packagesDir, name);
  return fs.statSync(packagePath).isDirectory();
});

console.log(`Bumping ${bumpType} version for all packages...\n`);

let newVersion = null;
packages.forEach(packageName => {
  const packagePath = path.join(packagesDir, packageName);
  const result = updatePackageVersion(packagePath);
  if (result && !newVersion) {
    newVersion = result.newVersion;
  }
});

console.log(`\nNew version: ${newVersion}`);
