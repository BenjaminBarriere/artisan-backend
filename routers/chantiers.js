const express = require("express")
const {
   ajouterChantier,
   getChantiers,
   getChantier,
   updateChantier,
   deleteChantier,
} = require("../controllers/chantiers")
const router = express.Router()
const { auth } = require("../middleware/auth")

router.route("/chantiers").post(auth, ajouterChantier)
router.route("/chantiers").get(getChantiers)
router.route("/chantiers/:id").get(getChantier)
router.route("/chantiers/:id").put(auth, updateChantier)
router.route("/chantiers/:id").delete(auth, deleteChantier)

module.exports = router
