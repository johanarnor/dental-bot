'use strict'

const scrapeIt = require('scrape-it')
// to avoid ssl errors (insecure I know...)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

module.exports.scrape = (event, context, callback) => {
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
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'Go Serverless v1.0! Your function executed successfully!',
  //     input: event
  //   })
  // }

  // callback(null, response)

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
}
