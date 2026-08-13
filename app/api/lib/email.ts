// Email service using Resend REST API directly (no SDK needed)
// Docs: https://resend.com/docs/api-reference/emails/send-email

const FROM_EMAIL = process.env.FROM_EMAIL || "AMENTA Farm <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "natnaeltamrat80@gmail.com";

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — email skipped:", subject);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend API error:", res.status, err);
    } else {
      console.log("Email sent:", subject, "→", to);
    }
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}

// ─── Contact Form: Notify Admin ─────────────────────────────────
export async function sendContactNotification(contact: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  await sendEmail(
    ADMIN_EMAIL,
    `[AMENTA Contact] ${contact.subject}`,
    `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); padding: 24px 32px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px;">🌿 New Contact Message</h1>
        <p style="color: #bbf7d0; margin: 4px 0 0 0; font-size: 14px;">AMENTA Integrated Forage</p>
      </div>
      <div style="padding: 32px;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 100px;">From:</td><td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${contact.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email:</td><td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${contact.email}" style="color: #166534;">${contact.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Subject:</td><td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${contact.subject}</td></tr>
        </table>
        <div style="background: #f9fafb; border-radius: 8px; padding: 20px; border-left: 4px solid #166534;">
          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #374151; white-space: pre-wrap;">${contact.message}</p>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">Reply directly to <a href="mailto:${contact.email}" style="color: #166534;">${contact.email}</a></p>
      </div>
    </div>`
  );
}

// ─── Contact Form: Auto-reply to Sender ─────────────────────────
export async function sendContactAutoReply(contact: {
  name: string;
  email: string;
  subject: string;
}) {
  await sendEmail(
    contact.email,
    `Re: ${contact.subject} — We received your message`,
    `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); padding: 24px 32px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px;">🌿 AMENTA Integrated Forage</h1>
      </div>
      <div style="padding: 32px;">
        <p style="font-size: 16px; color: #111827; margin: 0 0 16px 0;">Dear ${contact.name},</p>
        <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0 0 16px 0;">
          Thank you for reaching out to us! We have received your message regarding <strong>"${contact.subject}"</strong> and our team will get back to you as soon as possible.
        </p>
        <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0 0 16px 0;">
          We typically respond within 24-48 hours during business days.
        </p>
        <div style="background: #f0fdf4; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; font-size: 13px; color: #166534; font-weight: 600;">📍 AMENTA Integrated Forage Farm</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #15803d;">South Omo Zone, SNNPR, Ethiopia</p>
        </div>
        <p style="font-size: 14px; color: #374151; margin: 0;">Best regards,<br/><strong>The AMENTA Team</strong></p>
      </div>
      <div style="background: #f9fafb; padding: 16px 32px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">This is an automated response. Please do not reply directly to this email.</p>
      </div>
    </div>`
  );
}

// ─── Newsletter: Welcome Email ──────────────────────────────────
export async function sendNewsletterWelcome(email: string) {
  await sendEmail(
    email,
    "Welcome to AMENTA Farm Newsletter! 🌿",
    `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); padding: 32px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🌿 Welcome to AMENTA!</h1>
        <p style="color: #bbf7d0; margin: 8px 0 0 0; font-size: 14px;">Integrated Forage Farm Newsletter</p>
      </div>
      <div style="padding: 32px;">
        <p style="font-size: 16px; color: #111827; line-height: 1.6; margin: 0 0 16px 0;">Thank you for subscribing to our newsletter! 🎉</p>
        <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0 0 16px 0;">You'll receive updates on:</p>
        <ul style="font-size: 14px; color: #374151; line-height: 2; padding-left: 20px; margin: 0 0 24px 0;">
          <li>🌱 Seasonal crop updates and farming insights</li>
          <li>📰 Latest news from AMENTA Farm</li>
          <li>📊 Market trends and forage industry updates</li>
          <li>🎯 Upcoming events and opportunities</li>
        </ul>
        <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0;">Stay connected with us as we work towards sustainable agriculture in Ethiopia.</p>
      </div>
      <div style="background: #f9fafb; padding: 16px 32px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">AMENTA Integrated Forage • South Omo Zone, SNNPR, Ethiopia</p>
      </div>
    </div>`
  );
}

// ─── Newsletter: Bulk Send ──────────────────────────────────────
export async function sendBulkNewsletter(
  recipients: string[],
  subject: string,
  content: string
) {
  let sent = 0;
  let failed = 0;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — bulk email skipped");
    return { sent: 0, failed: recipients.length };
  }

  // Send in batches of 10 to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    const promises = batch.map(async (email) => {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: email,
            subject,
            html: `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
                <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); padding: 24px 32px;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 20px;">🌿 AMENTA Newsletter</h1>
                </div>
                <div style="padding: 32px;">
                  <div style="font-size: 14px; color: #374151; line-height: 1.8;">${content}</div>
                </div>
                <div style="background: #f9fafb; padding: 16px 32px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">AMENTA Integrated Forage • South Omo Zone, SNNPR, Ethiopia</p>
                </div>
              </div>`,
          }),
        });
        if (res.ok) sent++;
        else failed++;
      } catch {
        failed++;
      }
    });
    await Promise.all(promises);
  }

  console.log(`Bulk newsletter: ${sent} sent, ${failed} failed`);
  return { sent, failed };
}
