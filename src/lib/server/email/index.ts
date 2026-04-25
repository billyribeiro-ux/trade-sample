import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { Resend } from 'resend';

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

function getClient(): Resend | null {
  if (!env.RESEND_API_KEY) {
    return null;
  }

  return new Resend(env.RESEND_API_KEY);
}

export function getAppUrl(): string {
  return publicEnv.PUBLIC_APP_URL || 'http://localhost:5173';
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const client = getClient();
  const from = env.EMAIL_FROM || 'The Trading Store <support@localhost>';
  const replyTo = env.EMAIL_REPLY_TO || undefined;

  if (!client) {
    console.info(`[email] To: ${input.to}\\nSubject: ${input.subject}\\n${input.text}`);
    return;
  }

  await client.emails.send({
    from,
    to: input.to,
    ...(replyTo ? { replyTo } : {}),
    subject: input.subject,
    html: input.html,
    text: input.text,
  });
}
