const { ObjectID } = require("bson")
const client = require("../db/connect")
const { Infos } = require("../models/infos")
const yup = require("yup")
const phoneRegExp = /^(?=.*\d)[\d ]+$/
const { saveImage } = require("../functions/saveImage")
const htmlspecialchars = require("htmlspecialchars")
const fs = require("fs")

let schema = yup.object().shape({
   siteTitle: yup.string().required(),
   siteSubTitle: yup.string().required(),
   presentationTitle: yup.string().required(),
   presentationContent: yup.string().required(),
   presentationImage: yup.string().required(),
   adresse: yup.string().required(),
   codepostal: yup
      .string()
      .required()
      .matches(phoneRegExp, "Postal code is not valid"),
   ville: yup.string().required(),
   telephone: yup
      .string()
      .required()
      .matches(phoneRegExp, "Phone number is not valid"),
})

const ajouterInfos = async (req, res) => {
   schema
      .validate({
         siteTitle: req.body.siteTitle,
         siteSubTitle: req.body.siteSubTitle,
         presentationTitle: req.body.presentationTitle,
         presentationContent: req.body.presentationContent,
         presentationImage: req.body.presentationImage,
         adresse: req.body.adresse,
         codepostal: req.body.codepostal,
         ville: req.body.ville,
         telephone: req.body.telephone,
      })
      .catch((error) => {
         console.log(error.errors)
         res.status(501).json(error.errors)
      })
      .then(async (valid) => {
         if (valid) {
            try {
               let infos = new Infos(
                  req.body.siteTitle,
                  req.body.siteSubTitle,
                  req.body.presentationTitle,
                  req.body.presentationContent,
                  req.body.presentationImage,
                  req.body.adresse,
                  req.body.codepostal,
                  req.body.ville,
                  req.body.telephone
               )
               let result = await client
                  .db()
                  .collection("infos")
                  .insertOne(infos)

               res.status(200).json(result)
            } catch (error) {
               console.log(error)
               res.status(501).json(error)
            }
         }
      })
}

const getInfos = async (req, res) => {
   try {
      let cursor = client.db().collection("infos").find()
      let result = await cursor.toArray()
      if (result.length > 0) {
         res.status(200).json(result)
      } else {
         res.status(204).json({ msg: "Aucune infos trouvé" })
      }
   } catch (error) {
      console.log(error)
      res.status(501).json(error)
   }
}

const updateInfos = async (req, res) => {
   let siteTitle = req.body.siteTitle
   let siteSubTitle = req.body.siteSubTitle
   let presentationTitle = req.body.presentationTitle
   let presentationContent = req.body.presentationContent
   let presentationImage = req.body.presentationImage
   let adresse = req.body.adresse
   let codepostal = req.body.codepostal
   let ville = req.body.ville
   let telephone = req.body.telephone
   let modifImage = req.body.modifImage
   let image64 = ""

   if (!modifImage) presentationImage = htmlspecialchars(presentationImage)
   else {
      image64 = presentationImage
      presentationImage =
         "./images/infos/" + Date.now() + "_" + req.params.id + ".png"
   }

   schema
      .validate({
         siteTitle: siteTitle,
         siteSubTitle: siteSubTitle,
         presentationTitle: presentationTitle,
         presentationContent: presentationContent,
         presentationImage: presentationImage,
         adresse: adresse,
         codepostal: codepostal,
         ville: ville,
         telephone: telephone,
      })
      .catch((error) => {
         console.log(error.errors)
         res.status(501).json(error.errors)
      })
      .then(async (valid) => {
         if (valid) {
            try {
               let id = new ObjectID(req.params.id)

               let cursor = client.db().collection("infos").find({ _id: id })

               let resultGet = await cursor.toArray()

               let oldImage = resultGet[0].presentationImage

               let result = await client.db().collection("infos").updateOne(
                  { _id: id },
                  {
                     $set: {
                        siteTitle,
                        siteSubTitle,
                        presentationTitle,
                        presentationContent,
                        presentationImage,
                        adresse,
                        codepostal,
                        ville,
                        telephone,
                     },
                  }
               )

               if (result.modifiedCount === 1 && result.matchedCount === 1) {
                  if (image64 !== "") {
                     saveImage(image64, presentationImage)
                     fs.unlinkSync(oldImage)
                  }
                  res.status(200).json({
                     msg: "Modification réussie",
                     img: presentationImage,
                  })
               } else if (result.matchedCount === 1) {
                  res.status(304).json({
                     msg: "Rien a modifie, on renvoie la meme donnee",
                  })
               } else {
                  res.status(404).json({ msg: "Cet info n'existe pas" })
               }
            } catch (error) {
               console.log(error)
               res.status(501).json(error)
            }
         }
      })
}

module.exports = {
   ajouterInfos,
   getInfos,
   updateInfos,
}
