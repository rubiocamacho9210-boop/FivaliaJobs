#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const backendRoot = process.cwd();
const envPath = path.join(backendRoot, '.env');
const envExamplePath = path.join(backendRoot, '.env.example');

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: backendRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!fs.existsSync(envPath)) {
  if (!fs.existsSync(envExamplePath)) {
    console.error('Missing .env.example. Cannot create .env automatically.');
    process.exit(1);
  }

  fs.copyFileSync(envExamplePath, envPath);
  console.log('Created .env from .env.example');
}

console.log('\n[1/4] Starting PostgreSQL container...');
run('docker', ['compose', 'up', '-d']);

console.log('\n[2/4] Generating Prisma client...');
run('npx', ['prisma', 'generate']);

console.log('\n[3/4] Applying migrations...');
run('npx', ['prisma', 'migrate', 'deploy']);

console.log('\n[4/4] Seeding initial data...');
run('node', ['./prisma/seed.js']);

console.log('\nBackend local setup finished.');
console.log('Run: npm run start:dev');
