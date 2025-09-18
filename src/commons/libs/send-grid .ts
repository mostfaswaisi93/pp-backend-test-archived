import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

interface MailOptions {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendGridEmailService = (
  mailOptions: MailOptions
): Promise<void> => {
  return new Promise((resolve) => {
    sgMail
      .send(mailOptions as any)
      .then((response: any) => {
        console.log(response);
        resolve();
      })
      .catch((error: any) => {
        console.log(error);
        resolve();
      });
  });
};
