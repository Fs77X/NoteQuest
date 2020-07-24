// import all required libraries
const fs = require("fs")

// import and initialize database functions
const database_func = require("./database.js")
database_func.initialize()

//imported files/classes/functions
const drive = require("./drive")

// load in the credientials for the parent folder
const parents = fs.readFileSync("drive_folder.json")
const parents_info = JSON.parse(parents)
const parents_id = parents_info["parents"]

// purpose: serves to upload files to drive + store the info
// on a database. In addition
var upload_file = async function (req, res) {

    try{

        // check if all keys were sent by client (requirements)
        if (!req.files || !req.body.class || !req.body.prof || !req.body.user) {
            res.status(400).send({
                status: false,
                message: "Bad request"
            })
        }else{

            // clean up our data of any invalid characters
            var fileMetadata
            var classN = req.body.class.replace(/[^0-9a-zA-Z]/g, '');
            var profN = req.body.prof.replace(/[^a-zA-Z]/g, '');
            classN = classN.toUpperCase()
            profN = profN.toUpperCase()

            // create our folder + save our folder name
            var folderName = classN + "-" + profN
            var data = fs.readFileSync("folder.json")
            var jsonVAR = JSON.parse(data)
            var folderId

            // check if the folder exists in drive already
            if(!jsonVAR[folderName]){
                // folder was not found
                var fileMetadata = {
                    "name": folderName.toUpperCase(),
                    "mimeType": "application/vnd.google-apps.folder",
                    "parents": parents_id
                }
                // construct our folder in drive + save the folder id
                var file = await drive.files.create({ resource: fileMetadata, fields: "id" })
                let fId = file.data.id 
                let vals = {}
                vals[folderName] = fId
                // write the folder id to our local json file
                var data = fs.readFileSync("folder.json")
                var json = JSON.parse(data)
                json[folderName] = fId
                folderId = fId
                json = JSON.stringify(json)
                fs.writeFileSync("folder.json", json, "utf8")

            }else{
                folderId = jsonVAR[folderName]
            }

            // save our file locally
            let avatar = req.files.avatar
            await avatar.mv("./uploaded_files/" + avatar.name)
            res.send({
                status: true,
                message: "File uploaded",
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            })

            // pushing downloaded file to google drive
            fileMetadata = {
                "name": avatar.name,
                "parents": [folderId], // Folder ID at Google Drive

            }
            var media = {
                "shared": true,
                "mimeType": avatar.mimeType,
                "body": fs.createReadStream("./uploaded_files/" + avatar.name),
            }

            // upload the file from the client to google drive
            drive.files.create({
                resource: fileMetadata,
                media: media,

            }, function(err, file){
                if(err){
                    // Handle error
                    console.error(err);
                }else{
                    // add the url/file info to firebase
                    var fileId = file["data"]["id"]
                    //below is the url for our file in drive
                    url = "https://drive.google.com/file/d/" + fileId.toString() + "/preview"
                    database_func.put_data(classN, profN, url, avatar.name.toString(), req.body.user)
                    //now remove the file that is stored on hand
                    fs.unlink("./uploaded_files/" + avatar.name, function(err){
                        if(err){
                            console.log("unable to delete")
                        }
                    })
                }
            })
        }
    }catch(err){
        try{
            res.status(500).send(err)
            console.error(err);
        }catch(err){
            console.error(err);

        }
    }

}

module.exports = {
    upload_file
}
