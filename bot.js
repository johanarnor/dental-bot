/* global fetch */
import Prisma from '@prisma/client'
import exampleData from './exampleData.js'
import { sendEmail } from './email.js'

process.env.TZ = 'Europe/Stockholm' // tell node to parse dates without timestamp (e.g. startTime) with Stockholm timezone

const prisma = new Prisma.PrismaClient()

const alreadyExists = ({ id }) => prisma.appointment.findUnique({ where: { id } })
  .then(Boolean)

const notifyUsers = async (appointment) => {
  const users = await prisma.user.findMany({
    where: {
      active: true,
      clinics: { has: appointment.clinic }
    }
  })
  for (const user of users) {
    await sendEmail({
      to: user.email,
      subject: `Ny tandläkartid i ${appointment.clinic}!`,
      text: [
        appointment.description,
        `${appointment.startTime.toLocaleString('sv-SE')} i ${appointment.clinic}`,
        'https://www.folktandvardenstockholm.se/webbokning/boka-sista-minuten/'
      ].join('\n')
    })
  }
}

const main = async () => {
  // console.time('fetch')
  // const result = await fetch('https://www.folktandvardenstockholm.se/api/booking/lastminutenotcached')
  // console.time('fetch')
  // const appointments = await result.json()
  const appointments = exampleData
  // console.log(await result.json())
  for (const appointment of appointments) {
    if (await alreadyExists(appointment)) {
      console.log(`already seen ${appointment.id} skipping`)
      continue
    }

    const {
      id,
      timeType: {
        description
      },
      clinicName: clinic,
      startTime
    } = appointment
    const savedAppointment = await prisma.appointment.create({
      data: {
        id,
        description,
        clinic,
        startTime: new Date(startTime)
      }
    })
    console.log('saved appointment', JSON.stringify(savedAppointment))
    await notifyUsers(savedAppointment)
  }
}

main().catch(console.error)
