A small bot which scrapes last minutes appointments from Folktandvården Stockholm.

See https://www.folktandvardenstockholm.se/webbokning/boka-sista-minuten/ to test in in the browser.

Built with node & prisma (MongoDB Atlas), and runs on fly.io.

I've added [charts in MongoDB](https://charts.mongodb.com/charts-dental-bot-xfein/dashboards/62470c9e-a3ba-41a8-807e-ad240ff9ef7c) 🤯

## Deploy
The deploy is manual - run `flyctl deploy`

## Development
Some useful commands
- `npm start` run the bot
- `npx prisma generate` generate the prisma client from the schema
- `npx prisma studio` launches a dashboard over the data and supports filtering/creating objects etc
- `npx prisma format` formats the schema
- `flyctl logs` see the application logs (not available in Logtail, since there isn't any log drains)