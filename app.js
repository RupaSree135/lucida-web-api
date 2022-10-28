const express = require("express")
const bodyParser = require("body-parser")
const sequelize = require("./util/database")
const userRoute = require("./routes/UserDetails")
const orgRoute = require("./routes/OrgDetails")
const User = require("./models/user")
const Org = require("./models/org")
const session = require("express-session")

const SequelizeStore = require("connect-session-sequelize")(session.Store);

var store = new SequelizeStore({
  db: sequelize,
});

const app = express()
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json())

app.use(
  session({
    secret: "keyboard cat",
    store: store,
    resave: false,
    saveUninitialized : true
  })
);

store.sync()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use((req,res,next) => {
  Org.findByPk(1)
  .then(org => {
    req.org = org
    next()
  })
  .catch(err => console.log(Err))
})

app.use(userRoute)
app.use(orgRoute)

User.belongsTo(Org, { constraints: true })
Org.hasMany(User)

sequelize
// .sync({force : true})
.sync()
.then(result => {
    console.log("Resync done!!")
    app.listen(PORT, console.log(`Server started on port ${PORT}`));
})
.catch(err => {
    console.log(err)
})