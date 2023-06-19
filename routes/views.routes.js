//All EJS files

const express = require("express")
const utils = require("../utils/utils")
const {isAuthenticated} = require("../middlewares")

const router = express.Router()

//Get all tasks

// "/" is for route level calling
router.get("", (req, res) => {
    return utils.readData()
        .then((dataArr) => {
        return res.render("index", { title: "Home", todos: dataArr }) //title is object, Home is property
    })
})

//Add task

router.get("/todos/add", (req, res) => {
    return res.render("todo_add", {title: "Add"})
})


//Modify task

//to use single todo we use "/:title"
router.get("/todos/:title", (req,res) => {
    const title = req.params.title.toLowerCase()

    return utils.readData()
    .then((dataArr) => {
        const todo = dataArr.find((element) => (element.title.toLowerCase() === title))

        return res.render("todo", {title: "Update", todo})
    })
    
})

//Register

router.get("/auth/register", (req, res) => {
    return res.render("register", {title: "Register"})
})

//Login

router.get("/auth/login", (req, res) => {
    return res.render("login", {title: "Login"})
})


module.exports = router