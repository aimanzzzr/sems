const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        let urls = process.env.MONGO_DB_URL_PRODUCTION;
        const dbconn = await mongoose.connect(urls,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        console.log(`MongoDB Connected: ${dbconn.connection.host}`);
        
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;