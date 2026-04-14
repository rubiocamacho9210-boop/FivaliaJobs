#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const frontendRoot = process.cwd();

const requiredFiles = [
  "App.tsx",
  "index.js",
  "src/navigation/RootNavigator.tsx",
  "src/navigation/AppNavigator.tsx",
  "src/navigation/AuthNavigator.tsx",
  "src/store/authStore.ts",
  "src/services/api/client.ts",
  "src/screens/auth/LoginScreen.tsx",
  "src/screens/auth/RegisterScreen.tsx",
  "src/screens/feed/FeedScreen.tsx",
  "src/screens/posts/PostDetailScreen.tsx",
  "src/screens/posts/CreatePostScreen.tsx",
  "src/screens/feed/MyInterestsScreen.tsx",
  "src/screens/feed/MyProfileScreen.tsx",
  "src/screens/profile/PublicProfileScreen.tsx",
  "src/screens/profile/ProfileSetupScreen.tsx",
];

const requiredEnvKeys = ["EXPO_PUBLIC_API_BASE_URL"];

const errors = [];

function exists(relativePath) {
  return fs.existsSync(path.join(frontendRoot, relativePath));
}

function checkRequiredFiles() {
  requiredFiles.forEach((file) => {
    if (!exists(file)) {
      errors.push(`Missing required file: ${file}`);
    }
  });
}

function parseDotEnv(dotEnvPath) {
  if (!fs.existsSync(dotEnvPath)) {
    return {};
  }

  const raw = fs.readFileSync(dotEnvPath, "utf8");
  const out = {};

  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex <= 0) return;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    out[key] = value;
  });

  return out;
}

function checkEnvKeys() {
  const envPath = path.join(frontendRoot, ".env");
  const envExamplePath = path.join(frontendRoot, ".env.example");
  const sourcePath = fs.existsSync(envPath) ? envPath : envExamplePath;

  if (!fs.existsSync(sourcePath)) {
    errors.push("Missing .env and .env.example. At least one must exist.");
    return;
  }

  const envValues = parseDotEnv(sourcePath);
  requiredEnvKeys.forEach((key) => {
    if (!envValues[key]) {
      errors.push(`Missing env key ${key} in ${path.basename(sourcePath)}`);
    }
  });
}

function runTypecheck() {
  const result = spawnSync("npm", ["run", "typecheck"], {
    cwd: frontendRoot,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    errors.push("Typecheck failed.");
  }
}

function main() {
  console.log("Running smoke QA checks for FivaliaJobs mobile frontend...");
  checkRequiredFiles();
  checkEnvKeys();

  if (errors.length > 0) {
    console.error("\nSmoke checks failed before typecheck:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  runTypecheck();

  if (errors.length > 0) {
    console.error("\nSmoke checks failed:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("\nSmoke checks passed.");
}

main();
