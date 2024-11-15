const mongoose = require("mongoose")
// const URI = process.env.URI
const connectDB = (URI) => {
    mongoose.connect(URI)
        .then(() => console.log("Connected to database"))
        .catch((error) => console.log("Could not connect to database", error.message))
}


module.exports = connectDB