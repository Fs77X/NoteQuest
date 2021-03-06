require("dotenv").config()

//all imported libraries
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const _ = require("lodash")
const fileUpload = require("express-fileupload")

//imported functions/classes
const upload_file = require("./upload_file")
const send_data = require("./send_data")
const create_class = require("./create_class")
const verify = require("./verify_user")
const send_class_codes = require("./send_class_codes")
const rating = require("./rating");

//Port number the server runs off of
const PORT = 8080


//Server: construct an express webserver based on the specifications
//        that are required (all this is handled in the class)
class Server{

   constructor(){
      this.app = express()

      // all imported libraries that the server takes advantage of
      this.app.use(fileUpload({
         createParentPath: true
      }));
      this.app.use(cors())
      this.app.use(bodyParser.json())
      this.app.use(bodyParser.urlencoded({extended: true}))
      this.app.use(morgan("dev"))

      // route serves to check if the server is up and running
      this.app.get("/", function (req, res) {
         res.sendStatus(200)
      })

      // purpose: return the classes, professor, or both to our client
      this.app.get("/send_data", async (req, res) => {
         await send_data.send_data(req, res)
      })

      // purpose: handles uploading files + folder creations (if DNE)
      this.app.post("/upload_file",async(req,res)=>{
         await upload_file.upload_file(req,res)
      })

      // purpose: return all class codes for client prevents users 
      // typing in wrong codes i.e CS instead of CSE
      this.app.get("/send_class_codes", async(req,res) =>{
         await send_class_codes.send_class_codes(req,res)
      })

      // purpose: return the ratings for the documents of a specific
      // professor and class
      this.app.get("/get_rating", async(req, res) => {
         await rating.get_rating(req, res)
      })

      // purpose: checks if user email has ucsc.edu domain
      this.app.post("/verify_email", async(req, res) => {
         await verify.verify_email(req, res)
      })

      // purpose: set up the port we should be listening on
      this.app.listen(PORT,function(){
         console.log("connected and open on port " + PORT)
      })


   }


}

//below constructs and starts our server
var server = new Server()