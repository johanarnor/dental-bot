import nodemailer from 'nodemailer'

const EMAIL = 'mr.dentist.bot@gmail.com'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

export const sendEmail = ({ to, subject, text }) => transporter.sendMail({
  from: `"Dentist Bot" <${EMAIL}>`,
  to,
  subject,
  text
})
