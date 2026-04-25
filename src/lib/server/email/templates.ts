type EmailTemplate = {
  subject: string;
  html: string;
  text: string;
};

function layout(title: string, body: string): string {
  return `
    <div style="margin:0;background:#0b0f19;color:#eef2f8;font-family:Inter,Arial,sans-serif;padding:32px">
      <div style="max-width:560px;margin:0 auto">
        <p style="color:#8f9bad;font-size:13px;margin:0 0 32px">The Trading Store</p>
        <h1 style="font-size:24px;line-height:1.2;margin:0 0 16px">${title}</h1>
        <div style="color:#c4ccd8;font-size:16px;line-height:1.6">${body}</div>
        <p style="color:#6f7a8d;font-size:12px;margin:32px 0 0">Questions? Reply to this email.</p>
      </div>
    </div>
  `;
}

function button(url: string, label: string): string {
  return `<p style="margin:24px 0"><a href="${url}" style="display:inline-block;background:#3b82f6;color:#08111f;text-decoration:none;font-weight:700;padding:12px 16px;border-radius:6px">${label}</a></p>`;
}

export function verifyEmailTemplate(url: string): EmailTemplate {
  return {
    subject: 'Verify your email',
    html: layout(
      'Verify your email',
      `<p>Click below to confirm your email address.</p>${button(url, 'Verify email')}`,
    ),
    text: `Verify your email: ${url}`,
  };
}

export function welcomeEmailTemplate(): EmailTemplate {
  return {
    subject: 'Welcome to The Trading Store',
    html: layout(
      'Welcome to The Trading Store',
      '<p>Your account is ready. Browse books or sign in.</p>',
    ),
    text: 'Welcome to The Trading Store. Your account is ready.',
  };
}

export function passwordResetTemplate(url: string): EmailTemplate {
  return {
    subject: 'Reset your password',
    html: layout(
      'Reset your password',
      `<p>Click below to set a new password. This link expires soon.</p>${button(url, 'Reset password')}`,
    ),
    text: `Reset your password: ${url}`,
  };
}

export function magicLinkTemplate(url: string): EmailTemplate {
  return {
    subject: 'Your sign-in link',
    html: layout(
      'Your sign-in link',
      `<p>Click below to sign in. This link is single-use.</p>${button(url, 'Sign in')}`,
    ),
    text: `Sign in: ${url}`,
  };
}

export function purchaseConfirmationTemplate(data: {
  bookTitle: string;
  libraryUrl: string;
  receiptUrl: string | null;
}): EmailTemplate {
  return {
    subject: `Your purchase: ${data.bookTitle}`,
    html: layout(
      'Welcome to your library',
      `<p>Thank you. ${data.bookTitle} is in your library.</p>${button(data.libraryUrl, 'Go to library')}${
        data.receiptUrl ? `<p><a href="${data.receiptUrl}">View receipt</a></p>` : ''
      }`,
    ),
    text: `Thank you. ${data.bookTitle} is in your library: ${data.libraryUrl}`,
  };
}

export function refundIssuedTemplate(amount: string): EmailTemplate {
  return {
    subject: 'Your refund has been processed',
    html: layout(
      'Your refund has been processed',
      `<p>Your refund of ${amount} is on its way. It may take 5-10 business days.</p>`,
    ),
    text: `Your refund of ${amount} is on its way. It may take 5-10 business days.`,
  };
}

export function entitlementGrantedTemplate(data: {
  bookTitle: string;
  libraryUrl: string;
}): EmailTemplate {
  return {
    subject: "You've been granted access",
    html: layout(
      "You've been granted access",
      `<p>An admin has granted you access to ${data.bookTitle}.</p>${button(data.libraryUrl, 'Go to library')}`,
    ),
    text: `An admin has granted you access to ${data.bookTitle}: ${data.libraryUrl}`,
  };
}
