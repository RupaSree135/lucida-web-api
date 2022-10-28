const Org = require("../models/org")

exports.getOrgDetails = (req, res, next) => {
    Org.findAll()
        .then(data => {
            res.status(200).send(data)
        })
        .catch(err => console.log(err))
}

exports.createOrg = (req, res, next) => {
    const orgData = {
        name: req.body.name,
        logo_url: req.body.logo_url,
        auth_sign_url: req.body.auth_sign_url,
        location: req.body.location,
        address: req.body.address
    }

    Org.findOrCreate({
        where: {
            name: orgData.name
        },
        defaults: {
            logo_url: orgData.logo_url,
            auth_sign_url: orgData.auth_sign_url,
            location: orgData.location,
            address: orgData.address
        }
    })

        .then(([data, created]) => {  //if new row is created then created=true
            if (created) {
                console.log(data);
                res.status(200).send(data)
            }
            else {
                res.status(500).send({
                    message: "Organization already exists , please enter new details"
                });
            }
        })

        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Organization."
            });
        })

}

