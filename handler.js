const scrapeIt = require('scrape-it')
const mongoose = require('mongoose')
const Promise = require('bluebird')
const {Appointment, Filter, Notification} = require('./models')
const notify = require('./notify')

// Don't use mongoose deprecated promises
mongoose.Promise = global.Promise

// to avoid ssl errors (insecure I know...)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const getAppointmentId = (link) => {
  return require('crypto').createHash('md5').update(link).digest('hex')
}

const persistAndNotify = (appointment, filter) => {
  return Notification.findOne({appointment: appointment._id, filter: filter._id})
  .then((notification) => {
    if (notification) {
      console.log(`${filter._id} already notified for ${appointment._id}`)
    } else {
      console.log(`notifying filter ${filter._id} for appointment ${appointment._id}`)
      return new Notification({appointment: appointment._id, filter: filter._id})
      .save()
      .then(() => notify.email({
        to: filter.email,
        subject: `Ny tandläkartid hittad!`,
        text: `${appointment.treatment} kl ${appointment.time} den ${appointment.date} i ${appointment.clinic}.\n${appointment.link}`
      }))
    }
  })
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
    appointments.forEach(appointment => console.log('found appointment', JSON.stringify(appointment)))
    return Promise.map(appointments, (appointment) => {
      return Appointment
      .findByIdAndUpdate(getAppointmentId(appointment.link), appointment, {new: true, upsert: true, setDefaultsOnInsert: true})
      .then((appointment) => Filter
        .find({clinics: appointment.clinic, treatments: appointment.treatment})
        .then((filters) => Promise.map(filters, (filter) => persistAndNotify(appointment, filter)))
      )
    })
  })
  .catch(console.error)
  .then(() => mongoose.connection.close())
}
