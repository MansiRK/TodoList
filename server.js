const express = require ("express")
const fs = require("fs/promises")
const utils = require("./utils/utils")
const todoRouter = require("./routes/todos.routes")
const authRouter = require("./routes/auth.routes")
const viewsRouter = require("./routes/views.routes")
const middlewares = require("./middlewares/index")

//Initialize the express app
const app = express()

//set view engine i.e to mount other services from express
app.set("view engine", "ejs")

//middleware : code between initailization and routing
app.use(middlewares.logger)

app.use(express.json())

//greetings calls
app.get("/greetings", (req, res) => {
    return res.send("Greetings from TODO App.")
})

//view routers
app.use("/", viewsRouter)

//api routers
// "/api" to differentiate code api from frontend
app.use("/api/v1/todos", todoRouter)
app.use("/api/v1/auth", authRouter)

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})