const express = require("express")
const { sendEmail } = require("../controllers/mailer")
const router = express.Router()

router.route("/mail").post(sendEmail)

module.exports = router
