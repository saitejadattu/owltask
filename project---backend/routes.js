const express = require("express")
const User = require("./models")
const Router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const Authentication = async (req, res, next) => {
    let jwtToken
    try {
        const { authorization } = req["headers"]
        if (authorization) {
            jwtToken = authorization.split(" ")[1]
            await jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, (error, payload) => {
                if (error) {
                    res.status(400).json({
                        status: "failure",
                        message: error.message
                    })
                } else {
                    req.payload = payload.id
                    next()
                }
            })
        } else {
            res.status(400).json({
                status: "failure",
                message: "Invalid jwt Token"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: "failure",
            message: error.message
        })
    }
}
Router.get("/allusers", async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json({
            status: "success",
            message: users
        })
    } catch (error) {
        res.status(500).json({
            status: "success",
            message: error.message
        })
    }
})
Router.post("/signup", async (req, res) => {
    try {
        const userDetails = req.body
        const isUser = await User.findOne({ email: userDetails.email })
        if (!isUser) {
            const password = userDetails.password
            console.log(password)
            const hashedPassword = await bcrypt.hash(password, 10)
            const addUser = await User({ ...userDetails, password: hashedPassword })
            await addUser.save()
            res.status(200).json({
                status: "success",
                message: "signup successful"
            })
        } else {
            res.status(400).json({
                status: "failure",
                message: "email already in use"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: "failure",
            message: error.message
        })
    }
})

Router.post("/login", async (req, res) => {
    try {
        const userDetails = req.body
        const isUser = await User.findOne({ email: userDetails.email })
        if (isUser) {
            const { password } = userDetails
            const isPasswordValid = await bcrypt.compare(password, isUser.password)
            if (isPasswordValid) {
                const id = isUser.id
                const jwtToken = await jwt.sign({ id }, process.env.JWT_SECRET_KEY)
                res.send({
                    status: "success",
                    message: "login successful",
                    jwtToken
                })
            } else {
                res.send({
                    status: "failure",
                    message: "email/password are invalid"
                })
            }
        } else {
            res.status(400).json({
                status: "failure",
                message: "you don't have an account please signup before login"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: "failure",
            message: error.message
        })
    }
})

Router.patch("/update/:userId", Authentication, async (req, res) => {
    try {
        const userDetails = req.body
        const { username, email, password } = userDetails
        const userId = req.params.userId
        const user = await User.findById(userId)
        if (username) {
            user.username = username
        }
        if (email) {
            user.email = email
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            user.password = hashedPassword
        }
        await user.save()
        res.status(200).json({
            status: "success",
            message: "details has updated successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: "success",
            message: error.message
        })
    }
})
Router.delete("/delete/:userId", Authentication, async (req, res) => {
    try {
        const userId = req.params.userId
        const isUser = await User.findById(userId)
        console.log(isUser)
        if (isUser) {
            const deleteUser = await User.findByIdAndDelete(userId)
            res.status(200).json({
                status: "success",
                message: "your account deletion successful"
            })
        } else {
            res.status(400).json({
                status: "failure",
                message: "you don't have an account please signup first"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: "success",
            message: error.message
        })
    }
})
Router.get("/get/task/:userId", async (req, res) => {
    try {
        const { userId } = req.params
        const task = await User.findOne({ "_id": userId })
        res.status(200).json({
            status: "success",
            taskList: task.taskList
        })
    } catch (error) {
        res.status(500).json({
            status: "success",
            message: error.message
        })
    }
})
Router.post("/add/task/:userId", Authentication, async (req, res) => {
    try {
        const { userId } = req.params
        const newTask = req.body
        const addTask = await User.updateOne({ "_id": userId },
            { $push: { taskList: newTask } },
            { new: true },
            { runValidators: true }
        )
        res.status(200).json({
            status: "success",
            message: "task added successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: "success",
            message: error.message
        })
    }
})
Router.patch("/update/task/:userId/:taskId", async (req, res) => {
    try {
        const { userId, taskId } = req.params
        const update = req.body
        const { task_title, status } = update
        const updateTask = await User.updateOne({ "_id": userId, "taskList._id": taskId },
            { $set: { "taskList.$.task_title": task_title, "taskList.$.status": status } }
        )
        if (updateTask.modifiedCount > 0) {
            res.status(200).json({
                status: "success",
                message: "task updated successfully"
            })
        } else {
            res.status(500).json({
                status: "failure",
                message: "task not found"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: "failure",
            message: error.message
        })
    }
})
Router.delete("/delete/task/:userId/:taskId", async (req, res) => {
    try {
        const { userId, taskId } = req.params
        const isUser = await User.findById(userId)
        if (isUser) {
            const isTask = await isUser.taskList.find((each) => each.id === taskId)
            if (isTask) {
                const deleteTask = await User.updateOne({ _id: userId },
                    { $pull: { taskList: { _id: taskId } } }
                )
                res.status(200).json({
                    status: "success",
                    message: "task deleted successfully"
                })
            } else {
                res.status(400).json({
                    status: "failure",
                    message: "task not found"
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            status: "failure",
            message: error.message
        })
    }
})

module.exports = Router
