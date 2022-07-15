const jwt = require("jsonwebtoken")
const { login } = require("../controllers/utilisateur")
require("dotenv").config()

const auth = (req, res, next) => {
   try {
      const token = req.headers.authorization.split(" ")[1]
      req.token = jwt.verify(token, process.env.TOKEN_KEY)
      next()
   } catch {
      res.status(401).json({ message: "Token d'authentification invalide" })
   }
}

module.exports = {
   auth,
}
