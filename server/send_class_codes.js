
// purpose: return all the class_codes to the client (frontend)
var send_class_codes = async function(req,res){
   // the list of class_codes at UCSC
   var list = ["CSE","PHY","AMS","MATH","BIO","APLX","ARBC","ANTH","ART","ARTG","ASTR","BIOL","BIOC","BIOE",
               "BME","CRSN","CHEM","CHIN","CSP","AM","LGST","PSYC","PHYS","WRIT","ECON","STAT","MIPS","CC","PE-H",
               "EE","TIM","CLTE","MRL","OAK","PORT","CLNI","CMPM","COWL","CRES","CRSN","CRWN","DANM","EART","ECE",
               "EDUC","ENVS","ESCI","FILM","FMST","FREN","GAME","GERM","GREE","HAVC","HEBR","HISC","HIS","ITAL",
               "JAPN","JWST","KRSG","LAAD","LALS","LATN","LGST","LING","MERR","METX","MUSC","OAKS","OCEA","PBS",
               "PERS","PHIL","POLI","PRTR","PUNJ","RUSS","SCIC","SOCD","SOCY","SPAN","SPHS","STAT","STEV","THEA",
               "UCDC","YIDD"]

   // construct our json object to send to client
   var obj = {"codes": list}
   res.status(200).send(obj)
}

//export our function(s)
module.exports = {send_class_codes}