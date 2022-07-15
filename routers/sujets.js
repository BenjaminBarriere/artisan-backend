const express = require("express")
const {
   ajouterSujet,
   getSujet,
   getSujets,
   updateSujet,
   deleteSujet,
} = require("../controllers/sujets")
const router = express.Router()
const { auth } = require("../middleware/auth")

router.route("/sujets").post(auth, ajouterSujet)
router.route("/sujets").get(getSujets)
router.route("/sujets/:id").get(getSujet)
router.route("/sujets/:id").put(auth, updateSujet)
router.route("/sujets/:id").delete(auth, deleteSujet)

module.exports = router
