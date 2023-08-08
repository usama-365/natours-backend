const nodemailer = require("nodemailer");
const pug = require("pug");
const path = require("path");
const htmlToText = require("html-to-text");

module.exports = class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.name.split(" ")[0];
		this.url = url;
		this.from = `Muhammad Usama <${process.env.EMAIL_FROM}>`;
	}

	createTransport() {
		if (process.env.NODE_ENV === "production") {
			return 1;
		}
		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
	}

	async send(template, subject) {
		// Render HTML based on template
		const html = pug.renderFile(path.join(__dirname, "..", "views", "email", `${template}.pug`), {
			firstName: this.firstName,
			url: this.url,
			subject,
		});
		// Configure mail options
		const emailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText.convert(html),
		};
		// Create transporter and send mail
		await this.createTransport().sendMail(emailOptions);
	}

	async sendWelcome() {
		await this.send("welcome", "Welcome to the Natours family");
	}

	async sendPasswordReset() {
		await this.send("passwordReset", "Your password reset token (valid for only 10 minutes");
	}
};