const mongoose = require('mongoose')

const TREATMENTS = ['Undersökning', 'Borttagning av tandsten']

const Appointment = mongoose.model('Appointment', {
  _id: {
    type: String,
    required: true
  },
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
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Filter = mongoose.model('Filter', {
  email: {
    type: String,
    required: true
  },
  clinics: {
    type: [String],
    required: true
  },
  treatments: {
    type: [String],
    validate: (values) => values.every(value => TREATMENTS.includes(value))
  }
})

const Notification = mongoose.model('Notification', {
  appointment: {
    type: String,
    ref: 'Appointment'
  },
  user: {
    type: String,
    ref: 'Filter'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = {
  Appointment,
  Filter,
  Notification
}
