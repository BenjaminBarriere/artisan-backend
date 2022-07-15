const { ObjectID } = require("bson")
const client = require("../db/connect")
const { Chantiers } = require("../models/chantiers")
const htmlspecialchars = require("htmlspecialchars")
const yup = require("yup")
const { saveImage } = require("../functions/saveImage")

let schema = yup.object().shape({
   chantierTitle: yup.string().required(),
   chantierContent: yup.string().required(),
   chantierImage: yup.string().required(),
   chantierDate: yup.string().required(),
})

const ajouterChantier = async (req, res) => {
   let chantierTitle = htmlspecialchars(req.body.chantierTitle)
   let chantierContent = htmlspecialchars(req.body.chantierContent)
   let chantierImage = htmlspecialchars(req.body.chantierImage)
   let chantierDate = htmlspecialchars(req.body.chantierDate)
   let image64 = ""

   image64 = chantierImage
   chantierImage = "./images/chantiers/" + Date.now() + ".png"

   schema
      .validate({
         chantierTitle: chantierTitle,
         chantierContent: chantierContent,
         chantierImage: chantierImage,
         chantierDate: chantierDate,
      })
      .catch((error) => {
         console.log(error.errors)
         res.status(501).json(error.errors)
      })
      .then(async (valid) => {
         if (valid) {
            try {
               let chantier = new Chantiers(
                  chantierTitle,
                  chantierContent,
                  chantierImage,
                  chantierDate
               )
               let result = await client
                  .db()
                  .collection("chantiers")
                  .insertOne(chantier)

               if (image64 !== "") saveImage(image64, chantierImage)

               res.status(200).json({
                  result: result,
                  msg: "Chantier ajoute",
                  chantierTitle: chantierTitle,
                  chantierContent: chantierContent,
                  chantierImage: chantierImage,
                  chantierDate: chantierDate,
               })
            } catch (error) {
               console.log(error)
               res.status(501).json(error)
            }
         }
      })
}

const getChantiers = async (req, res) => {
   try {
      let cursor = client
         .db()
         .collection("chantiers")
         .find()
         .sort({ chantierDate: -1 })
      let result = await cursor.toArray()
      if (result.length > 0) {
         res.status(200).json(result)
      } else {
         res.status(204).json({ msg: "Aucun chantier trouvé" })
      }
   } catch (error) {
      console.log(error)
      res.status(501).json(error)
   }
}

const getChantier = async (req, res) => {
   try {
      let id = new ObjectID(req.params.id)
      let cursor = client.db().collection("chantiers").find({ _id: id })
      let result = await cursor.toArray()
      if (result.length > 0) {
         res.status(200).json(result[0])
      } else {
         res.status(204).json({ msg: "Ce chantier n'existe pas" })
      }
   } catch (error) {
      console.log(error)
      res.status(501).json(error)
   }
}

const updateChantier = async (req, res) => {
   let chantierTitle = htmlspecialchars(req.body.chantierTitle)
   let chantierContent = htmlspecialchars(req.body.chantierContent)
   let chantierImage = req.body.chantierImage
   let chantierDate = htmlspecialchars(req.body.chantierDate)
   let modifImage = req.body.modifImage
   let image64 = ""

   if (!modifImage) chantierImage = htmlspecialchars(chantierImage)
   else {
      image64 = chantierImage
      chantierImage =
         "./images/chantiers/" + Date.now() + "_" + req.params.id + ".png"
   }

   schema
      .validate({
         chantierTitle: chantierTitle,
         chantierContent: chantierContent,
         chantierImage: chantierImage,
         chantierDate: chantierDate,
      })
      .catch((error) => {
         console.log(error.errors)
         res.status(501).json(error.errors)
      })
      .then(async (valid) => {
         if (valid) {
            try {
               let id = new ObjectID(req.params.id)

               let result = await client.db().collection("chantiers").updateOne(
                  { _id: id },
                  {
                     $set: {
                        chantierTitle,
                        chantierContent,
                        chantierImage,
                        chantierDate,
                     },
                  }
               )

               if (result.modifiedCount === 1 && result.matchedCount === 1) {
                  if (image64 !== "") saveImage(image64, chantierImage)
                  res.status(200).json({
                     msg: "Modification réussie",
                     chantierTitle: chantierTitle,
                     chantierContent: chantierContent,
                     chantierImage: chantierImage,
                     chantierDate: chantierDate,
                  })
               } else if (result.matchedCount === 1) {
                  res.status(304).json({
                     msg: "Rien a modifie, on renvoie la meme donnee",
                  })
               } else {
                  res.status(404).json({ msg: "Ce chantier n'existe pas" })
               }
            } catch (error) {
               console.log(error)
               res.status(501).json(error)
            }
         }
      })
}

const deleteChantier = async (req, res) => {
   try {
      let id = new ObjectID(req.params.id)
      let result = await client
         .db()
         .collection("chantiers")
         .deleteOne({ _id: id })
      if (result.deletedCount === 1) {
         res.status(200).json({ msg: "Suppression réussie" })
      } else {
         res.status(404).json({ msg: "Ce chantier n'existe pas" })
      }
   } catch (error) {
      console.log(error)

      res.status(501).json(error)
   }
}

module.exports = {
   ajouterChantier,
   getChantiers,
   getChantier,
   updateChantier,
   deleteChantier,
}
