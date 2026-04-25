import * as v from 'valibot';

export const emailSchema = v.pipe(v.string(), v.email(), v.maxLength(254));

export const passwordSchema = v.pipe(v.string(), v.minLength(12), v.maxLength(128));

export const signInSchema = v.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = v.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema,
  name: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(120)),
});

export const forgotPasswordSchema = v.object({
  email: emailSchema,
});

export const changePasswordSchema = v.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
});

export function assertMatchingPasswords(password: string, confirmPassword: string): void {
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match.');
  }
}
