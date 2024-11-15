const { default: mongoose } = require("mongoose")
const mogoose = require("mongoose")
const {v4: uuidv4} = require("uuid")
const taskSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4 
    },
    task_title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const userSchema = new mogoose.Schema({
    _id: {
        type: String,
        default: uuidv4 
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    taskList: [taskSchema]
})


const User = mongoose.model("User", userSchema)

module.exports = User