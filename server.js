require('dotenv').config();
const app = require('./app');
const { db } = require('./database/config');
const initModel = require('./models/initModels');

db.authenticate()
    .then((res) => console.log('Database Authenticated! 🤝'))
    .catch((error) => console.log(error.message));

//RELATIONS
initModel();

db.sync()
    .then((res) => console.log('Database Synced! 🔄️'))
    .catch((error) => console.log(error.message));

const port = +process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`App running on port ${port} 🥳`);
});
