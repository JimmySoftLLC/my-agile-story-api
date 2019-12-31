// ==================================================================
// DATABASE
// ==================================================================
require('dotenv').config();

module.exports = function (mongoose) {
    if (process.env.NODE_ENVIRONMENT === 'production') {
        const db = mongoose
            .connect(
                'mongodb+srv://' +
                process.env.MONGO_USER +
                ':' +
                process.env.MONGO_PASSWORD +
                '@cluster0-yxay5.mongodb.net/test?retryWrites=true&w=majority', {
                    useNewUrlParser: true,
                    useCreateIndex: true,
                }
            )
            .then(() => {
                dataBaseErrorMessage = 'Connected to DB';
                console.log('Connected to DB');
            })
            .catch(err => {
                dataBaseErrorMessage = 'ERROR:' + err.message;
                console.log('ERROR:', err.message);
            });
    } else {
        const db = mongoose
            .connect('mongodb://localhost/my-agile-story-api', {
                useNewUrlParser: true,
                useCreateIndex: true,
            })
            .then(() => {
                console.log('Connected to DB');
            })
            .catch(err => {
                console.log('ERROR:', err.message);
            });
    }
}