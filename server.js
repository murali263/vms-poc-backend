const app = require("./app")
require("dotenv").config()
require("./connections/db")
const PORT = process.env.port||3000
app.listen(PORT,()=>{
    console.log(`server runs at ${PORT}`)
})