const scrapeIt = require('scrape-it')
const mongoose = require('mongoose')
const Promise = require('bluebird')
const {Appointment} = require('./models')

// to avoid ssl errors (insecure I know...)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const hash = ({date, time, clinic, treatment}) => {
  return require('crypto').createHash('md5').update(date + time + clinic + treatment).digest('hex')
}

module.exports.scrape = (event, context, callback) => {
  mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true})

  scrapeIt('https://www.folktandvardenstockholm.se/webbokning/tillgangliga-tider/?lastmin=true', {
    appointments: {
      listItem: '.booking-main tbody tr',
      data: {
        date: '[data-heading=Datum]',
        time: '[data-heading=Tid]',
        clinic: '[data-heading=Klinik]',
        treatment: '[data-heading=Behandling]',
        link: {
          selector: 'td a',
          how: (value) => value[0].attribs.href
        }
      }
    }
  })
  .then(({appointments}) => {
    return Promise.each(appointments, (appointment) => Appointment.findByIdAndUpdate(hash(appointment), appointment, {upsert: true}))
    .then((result) => {
      console.log('los result', result)
      mongoose.connection.close()
    })
    .catch((error) => {
      console.error(error)
      mongoose.connection.close()
    })
  })
  .catch(console.error)
}
