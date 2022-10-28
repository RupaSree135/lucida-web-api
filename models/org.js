const Sequelize = require("sequelize")
const sequelize = require("../util/database")

const Org = sequelize.define("orgs", {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNULL: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNULL: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Company name is required"
            }
        }
    },
    logo_url: {
        type: Sequelize.STRING,
        allowNULL: false
    },
    auth_sign_url: {
        type: Sequelize.STRING,
        allowNULL: false
    },
    location: {
        type: Sequelize.STRING,
        allowNULL: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Location is required"
            },
            isAlpha: {
                args: true,
                msg: "Please enter valid location"
            }
        }
    },
    address: {
        type: Sequelize.STRING,
        allowNULL: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Address is required"
            }
        }
    }
})



module.exports = Org