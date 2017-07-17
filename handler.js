const scrapeIt = require('scrape-it')
const mongoose = require('mongoose')
const Promise = require('bluebird')
const {Appointment, Filter, Notification} = require('./models')

// to avoid ssl errors (insecure I know...)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const getAppointmentId = (link) => {
  return require('crypto').createHash('md5').update(link).digest('hex')
}

const persistAndNotify = (appointmentId, filterId) => {
  return Notification.findOne({appointment: appointmentId, filter: filterId})
  .then((notification) => notification
    ? console.log(`filter ${filterId} already notified for appointment ${appointmentId}`)
    : new Notification({appointment: appointmentId, filter: filterId})
      .save()
      .then((notification) => console.log(`notifying filter ${filterId} for appointment ${appointmentId}`))
  )
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
    return Promise.map(appointments, (appointment) => {
      return Appointment
      .findByIdAndUpdate(getAppointmentId(appointment.link), appointment, {new: true, upsert: true, setDefaultsOnInsert: true})
      .then((appointment) => Filter
        .find({clinics: appointment.clinic, treatments: appointment.treatment})
        .then((filters) => Promise.map(filters, (filter) => persistAndNotify(appointment._id, filter._id)))
      )
    })
  })
  .catch(console.error)
  .then(() => mongoose.connection.close())
}
