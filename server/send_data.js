// import our database query functions
const database_func = require("./database.js")

var send_data = async function (req, res){
    // try-catch serves to try running our db functions; errors occur -> handled in catch
    // statement
    try{
        switch (req.query.mode) {
            case "file":
                // purpose: serves to query the database for specified notes from class and
                // professor
                // error handling: if the function fails -> jump to catch statement
                if (!req.query.prof || !req.query.class) {
                    res.status(400).send({
                        msg: "prof or class not sent"
                    })
                }else {
                    database_func.get_class_files_by_rating(req.query.class, req.query.prof, (result) => {
                        res.status(200).send({
                            file: result
                        })
                    })
                }

                break

            case "prof":
                // purpose: serves to query the database for a specific class
                // and return the professors for that class
                // error handling: if the function fails -> jump to catch statement
                if (!req.query.class) {
                    res.status(400).send({
                        msg: "class not sent"
                    })
                }else{
                    database_func.get_professors(req.query.class, (result) => {
                        res.send({
                            prof: result
                        })
                    })
                }

                break

            case "class":
                // purpose: serves to return all the classes in the database currently
                // error handling: if the function fails -> jump to catch statement
                database_func.get_classes((result) => {
                    res.send({
                        classes: result
                    })
                })

                break
            default:
                res.status(400).send({
                    msg: "bad mode sent"
                })
                console.log("Sending 400 from here!")
                console.log(req.query)

                break
        }
    } catch(err) {
        // first try to respond back to the client
        try{
            res.status(500).send(err)
        }catch(err){
            // if failed to send 500 -- this indicates that the client is no longer
            // reachable
            console.log("! send_data ERROR !")
        }
    }
}

//export our function(s)
module.exports = {send_data}