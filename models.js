const mongoose = require('mongoose')

const TREATMENTS = ['Tandsten']

const Appointment = mongoose.model('Appointment', {
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  clinic: {
    type: String,
    required: true
  },
  treatment: {
    type: String,
    required: true,
    enum: TREATMENTS
  },
  link: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  }
})

const User = mongoose.model('User', {
  email: {
    type: String,
    required: true
  },
  preferredClinics: {
    type: [String],
    required: true
  },
  preferredTreatments: {
    type: [String],
    validate: (values) => values.every(value => TREATMENTS.includes(value))
  }
})

const Notification = mongoose.model('Notification', {
  appointment: {type: String, ref: 'Appointment'},
  user: {type: String, ref: 'User'}
})

module.exports = {
  Appointment,
  User,
  Notification
}
