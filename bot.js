/* global fetch */
import Prisma from '@prisma/client'
import exampleData from './exampleData.js'

process.env.TZ = 'Europe/Stockholm' // tell node to parse dates without timestamp (e.g. startTime) with Stockholm timezone

const prisma = new Prisma.PrismaClient()

const alreadyExists = ({ id }) => prisma.appointment.findUnique({ where: { id } })
  .then(Boolean)

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
    const saveResult = await prisma.appointment.create({
      data: {
        id,
        description,
        clinic,
        startTime: new Date(startTime)
      }
    })
    console.log(saveResult)
  }
}

main().catch(console.error)
