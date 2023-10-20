import mongoose from 'mongoose'

const connectDb = async () => {

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log(`MongoDB Connected : ${conn.connection.host}`.cyan.underline)
    } catch (error) {
        console.error(`Error : ${error.message}`.red.underline.bold)
        process.exit()
    }
}

export default connectDb

// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connected to database'))
//     .catch((error) => console.error(error));