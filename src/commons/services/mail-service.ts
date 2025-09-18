import { Logger } from "../libs/logger";
import * as nodemailer from "nodemailer";
import * as hbs from "nodemailer-express-handlebars";

interface MailOptions {
  to: string;
  replyTo?: string | null;
  subject: string;
  template: string;
  context: Record<string, any>;
  attachments?: any;
  html?: string | null;
  cc?: string | null;
}

export class MailService {
  private static _instance: MailService;
  private _transporter: nodemailer.Transporter;

  private constructor() {
    this._transporter = this.initializeTransporter();
  }

  public static getInstance(): MailService {
    if (!this._instance) {
      this._instance = new MailService();
    }
    return this._instance;
  }

  private initializeTransporter(): nodemailer.Transporter {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    transporter.use(
      "compile",
      hbs({
        viewEngine: {
          partialsDir: `${__dirname}/../../views/email-templates/partials`,
          layoutsDir: `${__dirname}/../../views/email-templates/layouts`,
          extname: ".hbs",
        },
        extName: ".hbs",
        viewPath: `${__dirname}/../../views/email-templates/partials`,
      })
    );

    return transporter;
  }

  public async sendMail({
    to,
    replyTo = null,
    subject,
    template,
    context,
    attachments,
    html = null,
    cc = null,
  }: MailOptions): Promise<nodemailer.SentMessageInfo> {
    try {
      context.PORTAL_URL = process.env.PORTAL_URL;

      const mailOptions = {
        from: process.env.FROM_EMAIL,
        to,
        replyTo,
        subject,
        template,
        context,
        attachments,
        html,
        cc,
      };

      const info = await this._transporter.sendMail(mailOptions);
      Logger.Instance.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      Logger.Instance.error("Failed to send email", { error });
      throw new Error("Email sending failed");
    }
  }
}
