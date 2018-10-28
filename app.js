// Load config variables
const CONFIG = require('./config/config.js');

// Express
const express = require('express');
var router = express.Router();
const app = express();

// MySQL
const database = require('./database/database.js')(
    CONFIG.db_host,
    CONFIG.db_port,
    CONFIG.db_name,
    CONFIG.db_user,
    CONFIG.db_password
);

//database.destroy();
database.initialise();

// Init
// database.connect(err => {
//     if (err) {
//         console.error('An error occurred while connecting to the DB');
//         throw err
//     } else {
//         console.log('Database connection successful!');
//     }
// });

router.get('/', (req, res) => {
    res.send('Hello World 2!')
});

app.use(router);

// app.listen(CONFIG.port, () => {
//     console.log('Example app listening on port ' + CONFIG.port + '!')
// });