const { ObjectID } = require("bson")
const client = require("../db/connect")
const { Sujets } = require("../models/sujets")
const htmlspecialchars = require("htmlspecialchars")
const yup = require("yup")

let schema = yup.object().shape({
   sujet: yup.string().required(),
})

const ajouterSujet = async (req, res) => {
   let sujetTmp = htmlspecialchars(req.body.sujet)

   schema
      .validate({
         sujet: sujetTmp,
      })
      .catch((error) => {
         console.log(error.errors)
         res.status(501).json(error.errors)
      })
      .then(async (valid) => {
         if (valid) {
            try {
               let sujet = new Sujets(sujetTmp)
               let result = await client
                  .db()
                  .collection("sujets")
                  .insertOne(sujet)

               res.status(200).json(result)
            } catch (error) {
               console.log(error)
               res.status(501).json(error)
            }
         }
      })
}

const getSujets = async (req, res) => {
   try {
      let cursor = client.db().collection("sujets").find()
      let result = await cursor.toArray()
      if (result.length > 0) {
         res.status(200).json(result)
      } else {
         res.status(204).json({ msg: "Aucun sujet trouvé" })
      }
   } catch (error) {
      console.log(error)
      res.status(501).json(error)
   }
}

const getSujet = async (req, res) => {
   try {
      let id = new ObjectID(req.params.id)
      let cursor = client.db().collection("sujets").find({ _id: id })
      let result = await cursor.toArray()
      if (result.length > 0) {
         res.status(200).json(result[0])
      } else {
         res.status(204).json({ msg: "Ce sujet n'existe pas" })
      }
   } catch (error) {
      console.log(error)
      res.status(501).json(error)
   }
}

const updateSujet = async (req, res) => {
   let sujet = htmlspecialchars(req.body.sujet)

   schema
      .validate({
         sujet: sujet,
      })
      .catch((error) => {
         console.log(error.errors)
         res.status(501).json(error.errors)
      })
      .then(async (valid) => {
         if (valid) {
            try {
               let id = new ObjectID(req.params.id)

               let result = await client
                  .db()
                  .collection("sujets")
                  .updateOne({ _id: id }, { $set: { sujet } })

               if (result.modifiedCount === 1 && result.matchedCount === 1) {
                  res.status(200).json({
                     msg: "Modification réussie",
                     sujet: sujet,
                  })
               } else if (result.matchedCount === 1) {
                  res.status(304).json({
                     msg: "Rien a modifie, on renvoie la meme donnee",
                  })
               } else {
                  res.status(404).json({ msg: "Ce sujet n'existe pas" })
               }
            } catch (error) {
               console.log(error)
               res.status(501).json(error)
            }
         }
      })
}

const deleteSujet = async (req, res) => {
   try {
      let id = new ObjectID(req.params.id)
      let result = await client.db().collection("sujets").deleteOne({ _id: id })
      if (result.deletedCount === 1) {
         res.status(200).json({ msg: "Suppression réussie" })
      } else {
         res.status(404).json({ msg: "Ce sujet n'existe pas" })
      }
   } catch (error) {
      console.log(error)

      res.status(501).json(error)
   }
}

module.exports = {
   ajouterSujet,
   getSujets,
   getSujet,
   updateSujet,
   deleteSujet,
}
