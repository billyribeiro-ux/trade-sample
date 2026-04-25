declare global {
  namespace App {
    interface Locals {
      session: import('$lib/server/auth').AuthSession['session'] | null;
      user: import('$lib/server/auth').AuthSession['user'] | null;
    }
  }
}

export {};
