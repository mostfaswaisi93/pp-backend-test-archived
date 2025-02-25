import * as nodemailer from "nodemailer";
import * as hbs from "nodemailer-express-handlebars";
export class MailService {
	private static _instance;

	static get Instance() {
		return this._instance ? this._instance : (this._instance = new this());
	}

	private _transporter;

	constructor() {
		const options = {
			viewEngine: {
				partialsDir: __dirname + "/../../views/email-templates/partials",
				layoutsDir: __dirname + "/../../views/email-templates/layouts",
				extname: ".hbs",
			},
			extName: ".hbs",
			viewPath: __dirname + "/../../views/email-templates/partials",
		};

		this._transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: process.env.SMTP_SECURE === "true",
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD,
			},
			tls: { rejectUnauthorized: false },
		});

		this._transporter.use("compile", hbs(options));
	}
	async sendMail({
		to,
		replyTo = null,
		subject,
		template,
		context,
		attachments,
		html = null,
		cc = null,
	}) {
		context.PORTAL_URL = process.env.PORTAL_URL;
		try {
			console.log("email");
			let info = await this._transporter.sendMail({
				to,
				replyTo,
				from: process.env.FROM_EMAIL,
				subject,
				template,
				context,
				attachments,
				html,
				cc,
			});
			console.log(info);
			return info;
		} catch (error) {
			throw new Error(error);
		}
	}
}
