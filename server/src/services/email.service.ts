import { Resend } from 'resend';
import { env } from '@/config/env';
import { EmailOptions, PayoutNotificationData, PurchaseReceiptData } from '@/types/emails';


class EmailService {
  private resend: Resend;
  private fromEmail: string;

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);
    this.fromEmail = env.EMAIL_FROM || 'noreply@kompa.com';
  }

  /**
   * Send a custom email
   */
  async sendEmail(options: EmailOptions): Promise<any> {
    try {
      const response = await this.resend.emails.send({
        from: this.fromEmail,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        cc: options.cc,
        bcc: options.bcc,
        replyTo: options.replyTo,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      console.log(`[Email] Sent to ${options.to} - ${options.subject}`);
      return response;
    } catch (error) {
      console.error('[Email Error]', error);
      throw {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to send email',
        error,
      };
    }
  }

  /**
   * Send purchase confirmation email
   */
  async sendPurchaseReceipt(data: PurchaseReceiptData): Promise<any> {
    const html = this.getPurchaseReceiptTemplate(data);

    return this.sendEmail({
      to: data.buyerEmail,
      subject: `Purchase Confirmed - Reference: ${data.reference}`,
      html,
    });
  }

  /**
   * Send payout confirmation email
   */
  async sendPayoutNotification(data: PayoutNotificationData): Promise<any> {
    const html = this.getPayoutNotificationTemplate(data);

    return this.sendEmail({
      to: data.sellerEmail,
      subject: `Payout Processed - ${data.currency} ${data.netAmount}`,
      html,
    });
  }

  /**
   * Send payout failed notification
   */
  async sendPayoutFailedNotification(
    sellerEmail: string,
    sellerName: string,
    reference: string,
    reason: string
  ): Promise<any> {
    const html = this.getPayoutFailedTemplate(sellerName, reference, reason);

    return this.sendEmail({
      to: sellerEmail,
      subject: `Payout Failed - Action Required`,
      html,
    });
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(
    email: string,
    name: string,
    userType: 'buyer' | 'seller'
  ): Promise<any> {
    const html = this.getWelcomeTemplate(name, userType);

    return this.sendEmail({
      to: email,
      subject: 'Welcome to Kompa!',
      html,
    });
  }

  /**
   * Send email verification link
   */
  async sendVerificationEmail(
    email: string,
    verificationLink: string,
    name?: string
  ): Promise<any> {
    const html = this.getVerificationTemplate(verificationLink, name);

    return this.sendEmail({
      to: email,
      subject: 'Verify Your Email - Kompa',
      html,
    });
  }

  /**
   * Send payment failed notification
   */
  async sendPaymentFailedEmail(
    buyerEmail: string,
    listingTitle: string,
    reference: string,
    reason: string
  ): Promise<any> {
    const html = this.getPaymentFailedTemplate(
      listingTitle,
      reference,
      reason
    );

    return this.sendEmail({
      to: buyerEmail,
      subject: `Payment Failed - ${reference}`,
      html,
    });
  }

  /**
   * Send listing published notification
   */
  async sendListingPublishedEmail(
    sellerEmail: string,
    listingTitle: string,
    listingUrl: string
  ): Promise<any> {
    const html = this.getListingPublishedTemplate(listingTitle, listingUrl);

    return this.sendEmail({
      to: sellerEmail,
      subject: `Your Listing is Live - ${listingTitle}`,
      html,
    });
  }

  // ============= EMAIL TEMPLATES =============

  private getPurchaseReceiptTemplate(data: PurchaseReceiptData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #222; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
            .detail-label { color: #666; }
            .detail-value { font-weight: 600; }
            .amount { font-size: 28px; font-weight: bold; color: #667eea; margin: 10px 0; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Purchase Confirmed</h1>
              <p>Thank you for your purchase!</p>
            </div>
            <div class="content">
              <div class="section">
                <p>Hi ${data.buyerName || 'Valued Customer'},</p>
                <p>Your purchase has been successfully completed. Here are your receipt details:</p>
              </div>

              <div class="section">
                <div class="section-title">Purchase Details</div>
                <div class="detail-row">
                  <span class="detail-label">Listing</span>
                  <span class="detail-value">${data.listingTitle}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Amount Paid</span>
                  <span class="detail-value">${data.currency} ${(data.amount / 100).toFixed(2)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Reference</span>
                  <span class="detail-value">${data.reference}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Transaction ID</span>
                  <span class="detail-value">${data.transactionId}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date</span>
                  <span class="detail-value">${new Date(data.purchasedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div class="section">
                <p>You can view your purchase details and access your comparable data anytime from your account dashboard.</p>
              </div>

              <div style="text-align: center;">
                <a href="${env.CORS_ORIGIN}/purchases/${data.transactionId}" class="button">View Purchase</a>
              </div>

              <div class="section" style="background: #f9f9f9; padding: 15px; border-radius: 6px;">
                <p style="margin: 0; font-size: 13px; color: #666;">
                  <strong>Questions?</strong> Contact our support team at support@kompa.com
                </p>
              </div>

              <div class="footer">
                <p>© 2025 Kompa. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getPayoutNotificationTemplate(data: PayoutNotificationData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #11b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #222; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
            .detail-label { color: #666; }
            .detail-value { font-weight: 600; }
            .amount { font-size: 28px; font-weight: bold; color: #11b981; margin: 10px 0; }
            .fee-breakdown { background: #f0fdf4; padding: 15px; border-left: 4px solid #11b981; border-radius: 4px; }
            .fee-item { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; }
            .button { display: inline-block; background: #11b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 Payout Processed</h1>
              <p>Your earnings have been transferred</p>
            </div>
            <div class="content">
              <div class="section">
                <p>Hi ${data.sellerName || 'Seller'},</p>
                <p>Great news! Your payout has been successfully processed.</p>
              </div>

              <div class="section">
                <div class="section-title">Payout Summary</div>
                <div class="amount">${data.currency} ${(data.netAmount / 100).toFixed(2)}</div>
                <div class="detail-row">
                  <span class="detail-label">Reference</span>
                  <span class="detail-value">${data.reference}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Payout Method</span>
                  <span class="detail-value">${data.payoutMethod}</span>
                </div>
                ${data.estimatedArrival ? `
                <div class="detail-row">
                  <span class="detail-label">Estimated Arrival</span>
                  <span class="detail-value">${data.estimatedArrival}</span>
                </div>
                ` : ''}
              </div>

              <div class="section">
                <div class="section-title">Breakdown</div>
                <div class="fee-breakdown">
                  <div class="fee-item">
                    <span>Gross Amount</span>
                    <span>${data.currency} ${(data.amount / 100).toFixed(2)}</span>
                  </div>
                  <div class="fee-item">
                    <span>Platform Fee (-${((data.platformFee / data.amount) * 100).toFixed(1)}%)</span>
                    <span>-${data.currency} ${(data.platformFee / 100).toFixed(2)}</span>
                  </div>
                  <div class="fee-item">
                    <span>Payout Charges</span>
                    <span>-${data.currency} ${(data.payoutCharges / 100).toFixed(2)}</span>
                  </div>
                  <hr style="margin: 10px 0; border: none; border-top: 1px solid #e0e0e0;">
                  <div class="fee-item" style="font-weight: 600; color: #11b981;">
                    <span>Net Amount</span>
                    <span>${data.currency} ${(data.netAmount / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div class="section" style="background: #f9f9f9; padding: 15px; border-radius: 6px;">
                <p style="margin: 0; font-size: 13px; color: #666;">
                  <strong>Processing time:</strong> Payouts typically arrive within 1-3 business days depending on your bank.
                </p>
              </div>

              <div class="footer">
                <p>© 2025 Kompa. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getPayoutFailedTemplate(
    sellerName: string,
    reference: string,
    reason: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; }
            .alert { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 4px; margin: 15px 0; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠ Payout Failed</h1>
              <p>Action Required</p>
            </div>
            <div class="content">
              <p>Hi ${sellerName},</p>
              <p>Unfortunately, your payout (Reference: <strong>${reference}</strong>) could not be processed.</p>
              
              <div class="alert">
                <strong>Reason:</strong> ${reason}
              </div>

              <p>Please contact our support team to resolve this issue and retry your payout.</p>

              <a href="${env.CORS_ORIGIN}/support" class="button">Contact Support</a>

              <div class="footer">
                <p>© 2025 Kompa. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getWelcomeTemplate(name: string, userType: 'buyer' | 'seller'): string {
    const message =
      userType === 'buyer'
        ? 'Browse and purchase comparable property data to make informed real estate decisions.'
        : 'Upload and sell comparable property data to earn money from your expertise.';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 8px; text-align: center; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Kompa, ${name}! 🎉</h1>
            </div>
            <div class="content">
              <p>We're thrilled to have you on board!</p>
              <p>${message}</p>
              
              <p>To get started:</p>
              <ol>
                <li>Complete your profile</li>
                <li>Verify your email address</li>
                <li>Set up your payment method</li>
              </ol>

              <a href="${env.CORS_ORIGIN}/dashboard" class="button">Get Started</a>

              <p style="margin-top: 20px; font-size: 14px; color: #666;">
                If you have any questions, feel free to reach out to support@kompa.com
              </p>

              <div class="footer">
                <p>© 2025 Kompa. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getVerificationTemplate(
    verificationLink: string,
    name?: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: 600; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify Your Email</h1>
            </div>
            <div class="content">
              <p>Hi ${name || 'there'},</p>
              <p>Please verify your email address to complete your account setup.</p>
              
              <a href="${verificationLink}" class="button">Verify Email</a>

              <p style="margin-top: 20px; font-size: 13px; color: #666;">
                This link expires in 24 hours. If you didn't create this account, you can ignore this email.
              </p>

              <div class="footer">
                <p>© 2025 Kompa. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getPaymentFailedTemplate(
    listingTitle: string,
    reference: string,
    reason: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; }
            .alert { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; }
            .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Failed</h1>
            </div>
            <div class="content">
              <p>We're sorry, but your payment for <strong>${listingTitle}</strong> could not be processed.</p>
              
              <div class="alert">
                <strong>Reference:</strong> ${reference}<br>
                <strong>Reason:</strong> ${reason}
              </div>

              <p>Please try again with a different payment method or contact support.</p>

              <a href="${env.CORS_ORIGIN}/marketplace/purchase/retry?ref=${reference}" class="button">Try Again</a>

              <div class="footer">
                <p>© 2025 Kompa. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getListingPublishedTemplate(
    listingTitle: string,
    listingUrl: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Your Listing is Live!</h1>
            </div>
            <div class="content">
              <p>Congratulations! Your listing <strong>${listingTitle}</strong> has been published and is now visible to buyers on Kompa.</p>
              
              <p>Start earning today! Buyers can now purchase your comparable data.</p>

              <a href="${listingUrl}" class="button">View Your Listing</a>

              <p style="margin-top: 20px; font-size: 13px; color: #666;">
                Monitor your listing performance and earnings from your dashboard.
              </p>

              <div class="footer">
                <p>© 2025 Kompa. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
