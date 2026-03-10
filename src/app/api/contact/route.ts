import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Send email to support
    await resend.emails.send({
      from: 'BrandProbe Contact <noreply@brandprobe.com>',
      to: 'support@brandprobe.com',
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Form Submission</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(to right, #5B5BD5, #4A4AC5); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            </div>

            <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1f2937; margin-top: 0; font-size: 18px; border-bottom: 2px solid #5B5BD5; padding-bottom: 10px;">Contact Information</h2>

                <div style="margin-bottom: 15px;">
                  <strong style="color: #4b5563;">Name:</strong>
                  <p style="margin: 5px 0; color: #1f2937;">${name}</p>
                </div>

                <div style="margin-bottom: 15px;">
                  <strong style="color: #4b5563;">Email:</strong>
                  <p style="margin: 5px 0;">
                    <a href="mailto:${email}" style="color: #5B5BD5; text-decoration: none;">${email}</a>
                  </p>
                </div>

                <div style="margin-bottom: 15px;">
                  <strong style="color: #4b5563;">Subject:</strong>
                  <p style="margin: 5px 0; color: #1f2937;">${subject}</p>
                </div>
              </div>

              <div style="background: white; padding: 20px; border-radius: 8px;">
                <h2 style="color: #1f2937; margin-top: 0; font-size: 18px; border-bottom: 2px solid #5B5BD5; padding-bottom: 10px;">Message</h2>
                <p style="white-space: pre-wrap; color: #1f2937; line-height: 1.6;">${message}</p>
              </div>

              <div style="margin-top: 20px; padding: 15px; background: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #1e40af;">
                  💡 <strong>Tip:</strong> Click the email address above to reply directly to ${name}
                </p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                This message was sent from the BrandProbe contact form
              </p>
            </div>
          </body>
        </html>
      `,
    });

    // Send confirmation email to user
    await resend.emails.send({
      from: 'BrandProbe Support <noreply@brandprobe.com>',
      to: email,
      subject: 'We received your message',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Message Received</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(to right, #5B5BD5, #4A4AC5); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Contacting Us!</h1>
            </div>

            <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #1f2937; margin-top: 0;">Hi ${name},</p>

              <p style="color: #4b5563;">
                We've received your message and will get back to you as soon as possible, typically within 24 hours (Monday-Friday).
              </p>

              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #5B5BD5;">
                <h3 style="margin-top: 0; color: #1f2937; font-size: 16px;">Your Message:</h3>
                <p style="color: #4b5563; margin: 0;"><strong>Subject:</strong> ${subject}</p>
                <p style="color: #4b5563; white-space: pre-wrap; margin-top: 10px;">${message}</p>
              </div>

              <p style="color: #4b5563;">
                In the meantime, you might find helpful information in our
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/support" style="color: #5B5BD5; text-decoration: none;">Support Center</a>.
              </p>

              <p style="color: #4b5563;">
                Best regards,<br>
                <strong>The BrandProbe Team</strong>
              </p>
            </div>

            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                BrandProbe - AI-powered marketing intelligence for startups
              </p>
              <p style="color: #9ca3af; font-size: 11px; margin: 5px 0;">
                If you didn't send this message, please ignore this email.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or email us directly at support@brandprobe.com' },
      { status: 500 }
    );
  }
}
