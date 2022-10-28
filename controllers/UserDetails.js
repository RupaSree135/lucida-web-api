const User = require("../models/user")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const nodemailer = require("nodemailer")

exports.getUserDetails = (req, res, next) => {
    User.findAll()
        .then(users => {
            res.status(200).send(users)
        })
        .catch(err => console.log(err))
}

exports.createUser = (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const role = req.body.role
    const org_id = req.body.org_id
    const pic_url = req.body.pic_url
    const password = req.body.password

    User.findOrCreate({
        where: {
            name: name,
            email: email
        },
        defaults: {
            role: role,
            org_id: org_id,
            pic_url: pic_url,
            password: password,
            orgId: req.org.id
        }
    })
        .then(([data, created]) => {
            if (created) {
                console.log(data);
                res.status(200).send(data)
            }
            else {
                res.status(500).send({
                    message: "User already exists , please enter new details"
                });
            }
        })

        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    User.findOne(
        {
            where: {
                email: email
            }
        }
    )
        .then(user => {
            if (!user) {
                return res.status(500).send("User doesn't exist")
            }

            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user
                        return req.session.save(err => {
                            console.log(err);
                            res.status(200).send(user)
                        })
                    }
                    res.status(500).send("password is incorrect");
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.status(200).send("User logged off successfully")
    })
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
        }

        const token = buffer.toString("hex")
        User.findOne({
            where: {
                email: req.body.email
            }
        })
            .then(user => {
                if (!user) {
                    return res.status(500).send("User doesn't exist")
                }
                user.resetToken = token
                user.resetTokenExpiration = Date.now() + 3600000
                return user.save()
            })

            .then(result => {
                res.status(200).send(result)
            })

            .catch(err => {
                console.log(err);
            })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    User.findAll({
        where: { resetToken: token , resetTokenExpiration: { $gt: Date.now() }}
    })
        .then(user => {
            if (user) {
              res.status(200).send(user)
            }
            res.status(500).send("Token doesn't matches and user is not available")
        })
        .catch(err => {
          console.log(err);
        });
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findAll({
        where: {
            resetToken: passwordToken,
            resetTokenExpiration: { $gt: Date.now() },
            id: userId
        }
    })
        .then(user => {
            resetUser = user;
            console.log(resetUser.password);
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = newPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.status(200).send("Password updated successfully");
        })
        .catch(err => {
            console.log(err);
        });
};
