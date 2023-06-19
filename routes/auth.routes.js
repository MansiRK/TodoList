const express = require("express")
const { body, validationResult } = require("express-validator")
const JWT = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const utils = require("../utils/utils")
const fs = require("fs/promises")
const { SECRET } = require("../config")
const router = express.Router()


//Register

router.post("/register",
    body("name").custom((name) => {
        if (typeof name === "string" && name.length >= 5) {
            return true
        }
        return false
    }).withMessage("Title should be string and of lenght greater than 5 or equal"),


    body("email").isEmail()

        .withMessage("Enter email in proper format"),

    body("password").custom((password) => {
        if (typeof password === "string" && password.length >= 8) {
            return true
        }
        return false
    }).withMessage("Password should be of minimum 8 characters"),


    (req, res) => {

        const { name, email, password } = req.body

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400)
                .json({
                    message: "User registration failed",
                    error: errors.array(),
                    data: {}
                })
        }

        const salt = bcrypt.genSaltSync(10)

        const hashed_password = bcrypt.hashSync(password, salt)

        new_data = { name, email, hashed_password }

        console.log("Registered User", new_data, password)
        // console.log("----user info---", name, email, password)

        return utils.readUser()

            .then((data) => {
                data.push(new_data)
                return fs.writeFile("user.json", JSON.stringify(data))
            })

            .then(() => {

                // const token = JWT.sign({ email }, SECRET)
                return res.status(201)
                    .json({
                        message: "User registered successfully.",
                        data: {},
                        error: null
                    })
            })

            .catch((error) => {
                return res.status(400)
                    .json({
                        message: "User registration failed.",
                        data: {},
                        error: error.message ? error.message : error.toString()
                    })
            })

    }
)

// console.log(USER)
// USER.push(
//     {
//         name, 
//         email,
//         password
//     }
// )


//Login

router.post("/login", (req, res) => {
    const { email, password } = req.body

    console.log("----user info ----", email, password)

    // USER.push(
    //     {

    //         email,
    //         password
    //     }
    // )

    return utils.readUser()

        .then((data) => {
            if (data.length <= 0) { //User doesn't exist
                return res.status(400).json({
                    message: "User login failed",
                    error: "User does not exists",
                    data: {}
                })
            }

            const user_index = data.findIndex((user) => user.email === email)

            if (user_index === -1) {
                return res.status(404).json({
                    message: "User login failed",
                    error: "User does not found",
                    data: {}
                })
            }

            // const compare_password = await bcrypt.compare(password, data[user_index].password)
            // if (data[user_index].password !== password)
            // {
            //     return res.status(404).json({
            //         message: "User login failed",
            //         error: "Invalid password",
            //         data: {}
            //     })
            // }

            const compare_password = bcrypt.compareSync(password, data[user_index].hashed_password)
            // if (data[user_index].password !== password)
            if (!compare_password) {
                return res.status(404).json({
                    message: "User login failed",
                    error: "Invalid password",
                    data: {}
                })
            }

            //create access token
            //response to client using jwt 

            const token = JWT.sign({ email }, SECRET)

            return res.status(200).json({
                message: "User login successful",
                error: null,
                data: {
                    access_token: token
                }
            })
        })
})

module.exports = router