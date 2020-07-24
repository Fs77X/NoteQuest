const database_func = require("./database.js")

var get_rating = async function (req, res) {
    try {

        // Catch case where insufficient information is passed
        if (!req.query.class || !req.query.prof || !req.query.url) {
            res.status(400).send({message : "Missing queries for one of class, prof, or url"})
            return
        }

        switch (req.query.mode) {
            case "upvote":
                // If there is not enough information to make the query, return a 400 status
                if (!req.query.user) {
                    res.status(400).send({message : "Missing query for user"})
                    return
                }

                // purpose: update the number of upvotes for a file + store the user that upvoted.
                // storing the user is done to prevent one user inflating a files rating
                database_func.user_upvoted(req.query.user, req.query.class, req.query.prof, req.query.url)
                res.status(200).send({message:"Succesfully upvoted"})
                break;
            case "unupvote":
                // If there is not enough information to make the query, return a 400 status
                if (!req.query.user) {
                    res.status(400).send({message : "Missing query for user"})
                    return
                }

                // purpose: update the number of upvotes for a file + delete the user from the upvote list.
                // This will only update the total number upvotes if the user has already upvoted the file
                // previously.
                database_func.user_unupvoted(req.query.user, req.query.class, req.query.prof, req.query.url)
                res.status(200).send({message:"Succesfully unvoted"})
                break;
            case "status":

                // purpose: return all metadata on total number of upvotes on a specific file
                database_func.get_upvote_list(req.query.class, req.query.prof, req.query.url, result => {
                    res.status(200).send({
                        upvoted: result
                    })
                })
                break;
            default:
                res.status(400).send({message : "Bad mode, please use either upvote, unupvote, or status"})
        }

    // if any db functions fail
    }catch(err){
        // attempt to send a 500 error to our client
        try{
            res.status(500).send(err)
            console.error(err)
        // if attempt to reach client fails, print error to server
        }catch(err){
            console.error(err)
        }
    }
}

// export all function(s) for specified feature
module.exports = {get_rating}