const express = require("express")
const { connect } = require("./db/connect")
const routerUtilisateurs = require("./routers/utilisateur")
const routerInfos = require("./routers/infos")
const routerChantiers = require("./routers/chantiers")
const routerSujets = require("./routers/sujets")
const routerMailer = require("./routers/mailer")
const app = express()
const cors = require("cors")
require("dotenv").config()

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/images", express.static("images"))

app.use("/api/v1", routerUtilisateurs)
app.use("/api/v1", routerInfos)
app.use("/api/v1", routerChantiers)
app.use("/api/v1", routerSujets)
app.use("/api/v1", routerMailer)

connect(process.env.DB_HOST, (err) => {
   if (err) {
      console.log("Erreur lors de la connexion à la base de données")
      console.log(err)
      process.exit(-1)
   } else {
      console.log("Connexion avec la base de données établie")
      app.listen(3005)
      console.log("Attente des requêtes au port 3OO5")
   }
})
