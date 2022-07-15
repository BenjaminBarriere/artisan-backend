const { ObjectID } = require("bson")
const client = require("../db/connect")
const { Utilisateur } = require("../models/utilisateur")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const yup = require("yup")

let schema = yup.object().shape({
   login: yup.string().required().email(),
   password: yup.string().required().min(8).max(64),
})

const ajouterUtilisateur = async (req, res) => {
   let login = req.body.login
   let password = req.body.password

   schema
      .validate({
         login: login,
         password: password,
      })
      .catch((error) => {
         console.log(error.errors)
         res.status(501).json(error.errors)
      })
      .then(async (valid) => {
         if (valid) {
            try {
               let utilisateur = new Utilisateur(login, password)
               let result = await client
                  .db()
                  .collection("utilisateurs")
                  .insertOne(utilisateur)

               res.status(200).json(result)
            } catch (error) {
               console.log(error)
               res.status(501).json(error)
            }
         }
      })
}

const getUtilisateurs = async (req, res) => {
   try {
      let cursor = client
         .db()
         .collection("utilisateurs")
         .find()
         .sort({ login: 1 })
      let result = await cursor.toArray()
      if (result.length > 0) {
         res.status(200).json(result)
      } else {
         res.status(204).json({ msg: "Aucun utilisateur trouvé" })
      }
   } catch (error) {
      console.log(error)
      res.status(501).json(error)
   }
}

const getUtilisateur = async (req, res) => {
   try {
      let id = new ObjectID(req.params.id)
      let cursor = client.db().collection("utilisateurs").find({ _id: id })
      let result = await cursor.toArray()
      if (result.length > 0) {
         res.status(200).json(result[0])
      } else {
         res.status(204).json({ msg: "Cet utilisateur n'existe pas" })
      }
   } catch (error) {
      console.log(error)
      res.status(501).json(error)
   }
}

const updateUtilisateur = async (req, res) => {
   let id = new ObjectID(req.params.id)
   let login = req.body.login
   let password = req.body.password

   schema
      .validate({
         login: login,
         password: password,
      })
      .catch((error) => {
         console.log(error.errors)
         res.status(501).json(error.errors)
      })
      .then(async (valid) => {
         if (valid) {
            try {
               let result = await client
                  .db()
                  .collection("utilisateurs")
                  .updateOne({ _id: id }, { $set: { login, password } })

               if (result.modifiedCount === 1) {
                  res.status(200).json({ msg: "Modification réussie" })
               } else {
                  res.status(404).json({ msg: "Cet utilisateur n'existe pas" })
               }
            } catch (error) {
               console.log(error)
               res.status(501).json(error)
            }
         }
      })
}

const updateSelf = async (req, res) => {
   let id = new ObjectID(req.token.id)
   let login = req.body.login
   let password = req.body.password

   schema
      .validate({
         login: login,
         password: password,
      })
      .catch((error) => {
         console.log(error.errors)
         res.status(501).json(error.errors)
      })
      .then(async (valid) => {
         if (valid) {
            try {
               let result = await client
                  .db()
                  .collection("utilisateurs")
                  .updateOne({ _id: id }, { $set: { login, password } })

               if (result.modifiedCount === 1) {
                  res.status(200).json({ msg: "Modification réussie" })
               } else {
                  res.status(404).json({ msg: "Cet utilisateur n'existe pas" })
               }
            } catch (error) {
               console.log(error)
               res.status(501).json(error)
            }
         }
      })
}

const deleteUtilisateur = async (req, res) => {
   try {
      let id = new ObjectID(req.params.id)
      let result = await client
         .db()
         .collection("utilisateurs")
         .deleteOne({ _id: id })
      if (result.deletedCount === 1) {
         res.status(200).json({ msg: "Suppression réussie" })
      } else {
         res.status(404).json({ msg: "Cet utilisateur n'existe pas" })
      }
   } catch (error) {
      console.log(error)

      res.status(501).json(error)
   }
}

const login = async (req, res) => {
   let result = await client.db().collection("utilisateurs")
   let login = req.body.email
   let password = req.body.password

   let row = result
      .find({ login: login, password: password })
      .toArray((err, result) => {
         if (err) {
            console.log(error)

            res.status(501).json(error)
         }
         const length = Object.keys(result).length

         if (length === 0)
            res.status(401).json({ message: "Login ou mdp incorrect" })
         else {
            let id = result[0]._id
            let token = jwt.sign({ userId: id }, process.env.TOKEN_KEY)

            res.status(200).json({ token })
         }
      })
}

module.exports = {
   ajouterUtilisateur,
   getUtilisateurs,
   getUtilisateur,
   updateUtilisateur,
   deleteUtilisateur,
   updateSelf,
   login,
}
