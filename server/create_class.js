//contain our components to create a new class in google drive
const drive = require("./drive")
const fs = require("fs")

var create_class = async function(req,res){
   if(req.query.class_name && req.query.professor){
      var name = req.query.class_name + "-" + req.query.professor
      var fileMetadata = {
         "name": name.toUpperCase(),
         "mimeType":"application/vnd.google-apps.folder",
         "parents": ["1xKsqMkKX078NNlyWKbDH20YADfL3qng9"]
      }
      drive.files.create({
         resource:fileMetadata,
         fields:"id"
      },function(err,file){
         if(err){
            //lmao
         }else{
            let folder_id = file.data.id //double check to make sure this is actual folder id
            //now lets write the file into our folder
            
            let vals = {}
            vals[name] = folder_id
            fs.readFile("folder.json", function (err, data){
               var json = JSON.parse(data)
               
               json[name] = folder_id
               json = JSON.stringify(json)
               fs.writeFile("folder.json",json,"utf8",function(err){
                  if(err){
                     console.log("something went wrong ... with writing")
                  }
               })
            })
         }
      });
      res.status(200).send("Folder Has Been Added")
   }else{
      res.status(400).send("Something went wrong")
   }
}

module.exports = {create_class}