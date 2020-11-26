import { User } from "../../types/user";
import admin from 'firebase-admin';
import nodemailer from 'nodemailer';

class EmailService {
    sendResetPassword(user: admin.auth.UserRecord, link: string) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: `${process.env.MAIL}`,
                pass: `${process.env.MAIL_PASSWORD}`
            }
        });
        console.log(process.env.MAIL, process.env.MAIL_PASSWORD);
        
    
        const mailOptions = {
            from: '"Extinguidor" <Extinguidor.instaladores.app@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: `Extinguidor reiniciar contraseña`, // Subject line
            text: "Extinguidor reiniciar contraseña", // plain text body
            html: `
                <h1>Datos del usuario:</h1>
                <p>Hola ${user.email}, para resetear tu contraseña de la aplicación haz click en el siguiente:</p>
                <h2><a src='${link}'>Enlace. Haz click aquí!</a></h2>
                `
        };
        return transporter.sendMail(mailOptions);
    }
}

export default new EmailService()