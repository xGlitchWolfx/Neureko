import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail', // usamos Gmail, no mailtrap
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const sendMailToRegister = (userMail, token) => {
  const mailOptions = {
    from: 'confirmacion@Neureko.com',
    to: userMail,
    subject: 'Neureko - Confirma tu cuenta',
    html: `
      <h2>Bienvenido a Neureko</h2>
      <p>Haz clic <a href="${process.env.URL_BACKEND}api/auth/confirmar/${token}">aquí</a> para confirmar tu cuenta.</p>
      <hr />
      <footer>¡Gracias por unirte a nuestra plataforma de gestión emocional!</footer>
    `
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar correo:', error)
    } else {
      console.log('Correo enviado satisfactoriamente:', info.messageId)
    }
  })
}

export default sendMailToRegister
