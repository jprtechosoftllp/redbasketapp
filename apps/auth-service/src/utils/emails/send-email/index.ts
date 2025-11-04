import nodemailer from 'nodemailer';
import ejs from 'ejs'
import path from 'path';
import { NextFunction } from 'express';

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT) || 587,
    service: process.env.SMTP_SERVICE!,
    auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!
    }
});

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP credentials are missing");
}
// Render an EJS email template
const renderEmailTemplate = async (templateName: string, data: Record<string, any>): Promise<string> => {
    const templatePath = path.join(
        process.cwd(),
        "apps",
        "auth-service",
        "src",
        "utils",
        "emails",
        "templates",
        `${templateName}.ejs`
    )

    return ejs.renderFile(templatePath, data)
}

export default async function sendEmail(to: string, subject: string, tamplateName: string, data: Record<string, any>, next: NextFunction) {
    try {

        const html = await renderEmailTemplate(tamplateName, data);

        await transport.sendMail({
            from: process.env.SMTP_USER!,
            to,
            subject,
            html
        })
        return true;
    } catch (error) {
        console.log("Error sending email", error);
        return next(error);
    }
}