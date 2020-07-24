// purpose: check if email that is sent from client is of ucsc.edu domain
const verify_email = async function (req, res) {

    try{
        //check if request has key: email
        if(req.body.hasOwnProperty("email")){
            //regular expression to check if email is of ucsc domain
            const sol = req.body.email.match
                ("^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(ucsc)\.edu$")

            //if no errors -> return 200 to client
            if(sol !== null){
                res.status(200).send({
                    message:"good"
                })

            }else{
                // if invalide -> return 403 to client
                res.status(403).send({
                    "message": "This email is not a ucsc email!"
                })
            }

        }else{
            //if no email was sent -> return 400 to client
            res.status(400).send({
                "message": "This is a bad request!"
            })
        }
        
        
        
    }catch(err){
        // if error occured above -> return a 500 to the client
        res.status(500).send({
            "message": "ruh roh"
        })

    }
}

// export function(s) that are required for feature
module.exports = {verify_email}