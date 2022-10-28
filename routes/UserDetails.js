const express = require("express")
const controller = require("../controllers/UserDetails")

const router = express.Router()

router.get("/users", controller.getUserDetails)

router.post("/users", controller.createUser)

router.post("/login" , controller.postLogin)

router.post("/logout" , controller.postLogout)

router.post("/reset" , controller.postReset)

router.get('/reset/:token', controller.getNewPassword);

router.post("/new-password" , controller.postNewPassword)


module.exports = router
