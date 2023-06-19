# Todo-app
 A simple Todo application which is built using ExpressJS and a run-time environment Node.js. This application allows you to create, update, and delete tasks and provides you a platform to manage your tasks easily

1. server created and run on port 3000

2. GET /greetings call --> "Hello World" of servers

3. GET /todos call -->
    readData --. readFile -->data(string) --> Array Object (JSON.parse)
    response object --> "message", "data" and "error"

4. POST /todos call -->
    middleware --> to get body from request object --> "express.json()" --> newTodo
    readData --> to get older data (for persistency)
    newTodo --> Pushed to array object --> "elder + newer = final data"
    fs.writeFile --> "final data" --> stringify(array object) --> stored
    
5. Utils
    import neccessary files/modules
    readData --> "file-path" --> read -->data(string) --> JSON.parse(data) --> Array Object
    module.exports = {...object} --> readData

EJS (Embedded JS)--->
it is used to write js in html format
EJS is used to render templates i.e html format

#EJS

basic syntax - <% some code %>
variable & value - <%= varName %>
string in syntax - <% "some value" %>
import syntax - <%- include("path/to/file") %>

partials in ejs -- to import any repeating code like nav and footer

Register - user info -> save in database

Register - user info -> password (hash & salt) -> hash is saved in db

Login - incoming info compare with saved info -> yes login allowed
-> no 

Login - incoming info -> password (plain text) -> compare (with salt) and hash saved in db -> yes or no

update / todo (protected)

if user is logged in we can use access token

Access token - encryption -> serect mixed with user info (mail)
