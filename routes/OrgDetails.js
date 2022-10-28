const express = require("express")
const controller = require("../controllers/OrgDetails")

const router = express.Router()

router.get("/orgs", controller.getOrgDetails)

router.post("/orgs", controller.createOrg)


module.exports = router
