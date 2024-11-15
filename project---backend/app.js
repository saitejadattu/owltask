const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const app = express()
const connectDB = require("./dbConnection")
const Router = require("./routes")
app.use(express.json())
app.use(cors())
require("dotenv").config()
app.use(morgan("dev"))

const URI = process.env.URI

connectDB(URI)
const PORT = process.env.PORT || 3006
app.use("/user", Router)
app.listen(PORT, () => console.log(`port runing at http://localhost:${PORT}`))
