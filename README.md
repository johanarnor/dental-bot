A small bot which scrapes last minutes appointments from Folktandvården Stockholm.

See https://www.folktandvardenstockholm.se/webbokning/boka-sista-minuten/ to test in in the browser.

Built with node & prisma (MongoDB Atlas), and runs on Heroku.

Logs are sent to Logtail and I've also added [charts in MongoDB](https://charts.mongodb.com/charts-dental-bot-xfein/dashboards/62470c9e-a3ba-41a8-807e-ad240ff9ef7c) 🤯

## Development
Some useful commands
- `npm start` run the bot
- `npx prisma generate` generate the prisma client from the schema
- `npx prisma format` formats the schema
- `heroku logs --tail --app dental-bot-johanarnor` see the logs Heroku logs (available in Logtail as well)