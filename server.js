const express = require ('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')


// Load env vars
dotenv.config({ path: './config/config.env'});

// Connect Database
connectDB();

// Routes Files
const bootcamps = require('./routes/bootcamps');


const app = express();

// Body Parser
app.use(express.json())

// Dev logging Middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// Mount Routers
app.use('/api/v1/bootcamps', bootcamps);

app.use(errorHandler);
 

const PORT = process.env.PORT || 5000

const server = app.listen(
    PORT,
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle Unhandled Rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server and exit process
    server.close(() => process(1)); 
})
