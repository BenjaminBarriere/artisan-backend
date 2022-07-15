const nodemailer = require("nodemailer")
require("dotenv").config()
const { ObjectID } = require("bson")
const client = require("../db/connect")

const sendEmail = async (req, res, next) => {
   // On verifie que le sujet soit renseigne pour faire un envoie d'email
   if (
      req.body.sujet === "chose" ||
      req.body.sujet === "" ||
      req.body.sujet === null ||
      req.body.sujet === undefined ||
      (req.body.sujet === "autre" && req.body.sujetLibre == "")
   ) {
      console.log("Pas de sujet renseigne, on ne fait rien !")
      res.status(501).json({ msg: "Aucun sujet choisi" })
   } else {
      var transport = {
         host: process.env.SMTP_HOST, // e.g. smtp.gmail.com
         auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
         },
      }

      var transporter = nodemailer.createTransport(transport)

      transporter.verify((error, success) => {
         if (error) {
            console.log(error)
         } else {
            console.log("Connexion au service de mail etabli")
         }
      })
      let sujet = ""

      if (req.body.sujet === "autre") sujet = req.body.sujetLibre
      else {
         try {
            let id = new ObjectID(req.body.sujet)
            let cursor = client.db().collection("sujets").find({ _id: id })
            let result = await cursor.toArray()
            sujet = result[0].sujet
         } catch (error) {
            // Si sujet invalide, ca plante pas mais envoie une erreur !
            console.log(error)
            res.status(501).json({ msg: "Sujet invalide !" })
         }
      }

      // Schema de l'email envoye
      var mail = {
         from: req.body.email,
         to: "alipetic@email.fr",
         subject: sujet,

         html: `Email provenant de : " ${req.body.nom} " <br><br> Message:<br><br>${req.body.message}`,
      }

      transporter.sendMail(mail, (err, data) => {
         if (err) {
            res.status(501).json({ msg: "Echec de l'envoi de l'email" })
         } else {
            res.status(200).json({ msg: "Email envoye" })
         }
      })
   }
}

module.exports = {
   sendEmail,
}
