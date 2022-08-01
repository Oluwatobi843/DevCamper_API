const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {

    // try {
    //     await mongoose.connect(db, {
    //         useNewUrlParser: true,
    //     }); 

    //     console.log(`MongoDb Connected: to DataBase`.cyan.underline.bold)
    // } catch (err) {
    //     process.exist(1)
    // }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true
        

    });

    console.log(`Mongo Db Connected: ${ conn.connection.host}`.cyan.underline.bold)
}

module.exports = connectDB