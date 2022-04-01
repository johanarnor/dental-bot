/* global fetch */
import Prisma from '@prisma/client'
import exampleData from './exampleData.js'

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
    if (await alreadyExists(appointment)) continue
    const saveResult = await prisma.appointment.create({
      data: {
        id: appointment.id,
        description: appointment.timeType.description
      }
    })
    console.log(saveResult)
  }
}

main().catch(console.error)
