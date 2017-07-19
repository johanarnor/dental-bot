const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
})

const email = ({to, subject, text}) => {
  return transporter.sendMail({
    from: `"Dentist Bot" <${process.env.GMAIL_EMAIL}>`,
    to,
    subject,
    text
  })
  .then(() => console.log('emailed', to, subject, text))
  .catch(console.error)
}

module.exports = {
  email
}
