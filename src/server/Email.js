const nodemailer = require('nodemailer');

/**
 * Basic styling.
 */
function getBasicStyles() {
	return `
  <style>
  table, tr, td, thead { border: 1px solid black; text-align:center; padding: 5px;}
  caption { text-align: center; padding: 10px; font-weight:bold; font-size: 14px; border: 1px solid black; border-bottom: 0px solid transparent; }
  span { padding: 5px; display: block; }
  </style>`;
}

/**
 * Get html for table based on args passed.
 */
function getTable(title, headers, data) {
	let table = `<table><caption> ${title} </caption><thead><tr>`;
	for (let i = 0; i < headers.length; i += 1) {
		table += `<th> ${headers[i]} </th>`;
	}
	table += '</tr></thead><tbody>';
	let handle = (value) => {
		table += `<td> ${value} </td>`;
	};

	for (let i = 0; i < data.length; i += 1) {
		table += '<tr>';
		Object.values(data[i]).forEach(handle);
		table += '</tr>';
	}
	table += '</tbody></table><br>';

	return table;
}



/**
 * Class for sending emails out using Gmails SMTP service.
 */
class Email {
	constructor() {
		this.transporter = this.getTransporter();
		this.emails = 'hichamtaha1@hotmail.com';
	}

	/**
	 * Grab nodemailer transport object using environment variables.
	 */
	getTransporter() {
		return nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.GOOGLE_USER,
				pass: process.env.GOOGLE_APP_PASSWORD
			}
		});
	}

	/**
	 * Emails to be forwarded to.
	 */
	setEmails(emails) {
		this.emails = emails;
	}

	/**
	 * Define email.
	 */
	getMailOptions(subject, html) {
		let to = this.emails;
		return {
			from: 'hichamtaha101@gmail.com',
			to: to,
			subject: subject,
			html: html
		};
	}

	/**
	 * Uses the nodemailer object to send out your email(s).
	 */
	sendMail(options, msg) {
		this.transporter.sendMail(options, (error) => {
			if (error) {
				console.log(error);
			} else {
				console.log(msg);
			}
		});
	}
}

module.exports = Email;
