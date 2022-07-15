const express = require("express")
const { ajouterInfos, getInfos, updateInfos } = require("../controllers/infos")
const router = express.Router()
const { auth } = require("../middleware/auth")

router.route("/infos").post(auth, ajouterInfos)
router.route("/infos").get(getInfos)
router.route("/infos/:id").put(auth, updateInfos)

module.exports = router
