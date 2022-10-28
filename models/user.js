const Sequelize = require("sequelize")
const sequelize = require("../util/database")
const bcrypt = require("bcrypt");
const { STRING, DATE } = require("sequelize");

const User = sequelize.define("users", {
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
                msg: "Name is required"
            }
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNULL: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Email-id required"
            },
            isEmail: {
                args: true,
                msg: 'Valid email-id required'
            }
        },
        unique: {
            args: true,
            msg: 'Email address already in use!'
        }
    },
    role : {
        type : Sequelize.STRING,
        allowNULL : false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Role is required"
            }
        }
    },
    org_id : {
        type : Sequelize.STRING,
        allowNULL : false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Organization id is required"
            }
        }
    },
    pic_url : {
        type : Sequelize.STRING,
        allowNULL : false
    },
    password : {
        type : Sequelize.STRING,
        allowNULL : false
    },
    resetToken : {
        type : STRING
    },
    resetTokenExpiration : {
        type : DATE
    }
})

// encrypts the password before submiting to the database
User.beforeCreate((user, options) => {

    return bcrypt.hash(user.password, 12)
        .then(hash => {
            user.password = hash;
        })
        .catch(err => {
            throw new Error();
        });
});



module.exports = User