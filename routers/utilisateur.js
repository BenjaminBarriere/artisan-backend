const express = require("express")
const {
   ajouterUtilisateur,
   getUtilisateurs,
   getUtilisateur,
   updateUtilisateur,
   deleteUtilisateur,
   updateSelf,
   login,
} = require("../controllers/utilisateur")
const router = express.Router()
const { auth } = require("../middleware/auth")

router.route("/utilisateurs").post(auth, ajouterUtilisateur)
router.route("/utilisateurs").get(auth, getUtilisateurs)
router.route("/utilisateurs/:id").get(auth, getUtilisateur)
router.route("/utilisateurs/:id").put(auth, updateUtilisateur)
router.route("/utilisateurs/").put(auth, updateSelf)
router.route("/utilisateurs/:id").delete(auth, deleteUtilisateur)
router.route("/login/").post(login)

module.exports = router
