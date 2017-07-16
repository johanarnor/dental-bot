const scrapeIt = require('scrape-it')
const mongoose = require('mongoose')
const {Appointment} = require('./models')

// to avoid ssl errors (insecure I know...)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const hash = (appointment) => {
  return require('crypto').createHash('md5').update('hello').digest('hex')
}

module.exports.scrape = (event, context, callback) => {
  mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true})

  new Appointment({ name: 'Zildjian', test: '34' })
  .save()
  .then((result) => {
    console.log(result)
    mongoose.connection.close()
  })
  .catch((error) => {
    console.error(error)
    mongoose.connection.close()
  })

  scrapeIt('https://www.folktandvardenstockholm.se/webbokning/tillgangliga-tider/?lastmin=true', {
    stuff: {
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
  .then((page) => {
    console.log(page)
  })
  .catch(console.error)
}
