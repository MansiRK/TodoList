const express = require("express")
const utils = require("../utils/utils")
const fs = require("fs/promises")
const { body, validationResult } = require("express-validator")
const { isAuthenticated } = require("../middlewares")

const todoRouter = express.Router() //Router() function in express

//To get all tasks

todoRouter.get("/", (req, res) => {
    // return res.send("All todos fetched.")
    return utils.readData()
        .then((data) => {
            return res.status(200).json({
                message: "All todos feteched",
                data,
                error: null
            })
        })

})

//To add new task
todoRouter.post(
    "/",
    isAuthenticated,
    body("title").custom((title) => {
        if (typeof title === "string" && title.length >= 3) {
            return true
        }
        return false
    }).withMessage("Title should be string and of length greater than 3 or equal"),

    body("completed").custom((completed) => {
        if (typeof completed === "boolean") {
            return true
        }
        return false
    }).withMessage("Completed should be true or false"),

    (req, res) => {

        const new_todo = req.body
        console.log("---body---", new_todo)

        //shows errors in response obj
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            console.log("----errors----", errors.array())

            return res.status(400).json({
                message: "Todo creation failed",
                error: errors.array(),
                data: {}
            })
        }
    
    return utils.readData()

        .then((data) => {
            data.push(new_todo)
            return fs.writeFile("db.json", JSON.stringify(data))
        })

        .then(() => {
            return res.status(201)
                .json({
                    message: "Todo created successfully.",
                    data: new_todo,
                    error: null
                })
        })

        .catch((error) => {
            return res.status(400)
                .json({
                    message: "Todo creation failed.",
                    data: {},
                    error: error.message ? error.message : error.toString()
                })
        })

    })


//To get single task

// title is parameter
// : is used to redirect it to title if we write anything in the path
todoRouter.get("/:title",isAuthenticated, (req, res) => {
    const title = req.params.title.toLowerCase()

    // console.log("---title---", title)

    // return res.send("Get ")

    return utils.readData()
        .then((dataArr) => {
            const todo_obj = dataArr.find((todo) => {
                return todo.title === title
            })

            return res.status(200)
                .json({
                    message: "Todo fetched successfully",
                    data: todo_obj,
                    error: null
                })
        })
})

//To update single task

todoRouter.put("/:title",isAuthenticated,

    (req, res) => {
        const title = req.params.title.toLowerCase()
        const update_todo = req.body

        return utils.readData()
            .then((dataArr) => {
                const idx = dataArr.findIndex((todo) => {
                    return todo.title === title
                })

                if (idx != -1) {
                    dataArr[idx] = {
                        ...dataArr[idx],
                        ...update_todo
                    }
                }
                return fs.writeFile("db.json", JSON.stringify(dataArr))
            })

            .then(() => {
                return res.status(200)
                    .json({
                        message: "Todo updated successfully",
                        data: update_todo,
                        error: null
                    })
            })
    })

    //To delete single task
todoRouter.delete("/:title", isAuthenticated, (req, res) => {
    const title = req.params.title.toLowerCase()
    let deleted_obj

    return utils.readData()
        .then((dataArr) => {
            const idx = dataArr.findIndex((todo) => {
                return todo.title === title
            })

            if (idx != -1) //if idx exist
            {
                deleted_obj = dataArr.splice(idx, 1)
            }
            return fs.writeFile("db.json", JSON.stringify(dataArr))
        })
        .then(() => {
            return res.status(200)
                .json({
                    message: "Todo deleted successfully",
                    data: deleted_obj,
                    error: null
                })
        })
})

// module.exports ={
//     todoRouter
// }

module.exports = todoRouter