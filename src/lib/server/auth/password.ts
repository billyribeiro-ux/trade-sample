import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from 'node:crypto';

const keyLength = 64;
const parameters = {
  N: 16_384,
  r: 8,
  p: 1,
};

type ScryptParts = {
  version: 'scrypt';
  n: number;
  r: number;
  p: number;
  keyLength: number;
  salt: string;
  key: string;
};

function encode(value: Buffer): string {
  return value.toString('base64url');
}

function decode(value: string): Buffer {
  return Buffer.from(value, 'base64url');
}

async function deriveKey(
  password: string,
  salt: Buffer,
  length: number,
  options: ScryptOptions,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, length, options, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });
}

function parseHash(hash: string): ScryptParts {
  const [version, n, r, p, hashKeyLength, salt, key] = hash.split('$');

  if (version !== 'scrypt' || !n || !r || !p || !hashKeyLength || !salt || !key) {
    throw new Error('Invalid password hash format.');
  }

  return {
    version,
    n: Number.parseInt(n, 10),
    r: Number.parseInt(r, 10),
    p: Number.parseInt(p, 10),
    keyLength: Number.parseInt(hashKeyLength, 10),
    salt,
    key,
  };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt, keyLength, parameters);

  return [
    'scrypt',
    parameters.N,
    parameters.r,
    parameters.p,
    keyLength,
    encode(salt),
    encode(key),
  ].join('$');
}

export async function verifyPassword({
  password,
  hash,
}: {
  password: string;
  hash: string;
}): Promise<boolean> {
  const parsed = parseHash(hash);
  const key = await deriveKey(password, decode(parsed.salt), parsed.keyLength, {
    N: parsed.n,
    r: parsed.r,
    p: parsed.p,
  });
  const expected = decode(parsed.key);

  return expected.byteLength === key.byteLength && timingSafeEqual(expected, key);
}
