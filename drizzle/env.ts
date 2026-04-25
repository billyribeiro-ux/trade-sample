import { existsSync, readFileSync } from 'node:fs';

export function loadLocalEnv(): void {
  if (!existsSync('.env')) {
    return;
  }

  const lines = readFileSync('.env', 'utf8').split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex);
    const value = trimmed.slice(separatorIndex + 1).replace(/^"|"$/g, '');

    process.env[key] ??= value;
  }
}

export function getDatabaseUrl(): string {
  loadLocalEnv();

  return (
    process.env.DATABASE_URL ?? 'postgres://trading_store:trading_store@127.0.0.1:55432/trading_store'
  );
}
