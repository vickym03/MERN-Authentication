const express = require("express");
const bodyParse = require("body-parser");
const jwt = require("jsonwebtoken");
//const bcrypt = require("bcrypt");

const app = express();
const ConnectDB = require("./database/ConnectDB");
const PORT = 8000;
const UserSchema = require("./schema/dbSchema");

//data base
ConnectDB();

//middle ware
const urlendcodedParse = bodyParse.urlencoded({ extended: false });
app.use(bodyParse.json(), urlendcodedParse);

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//register
app.post("/register", async (req, res) => {
  const user = req.body;

  //check for username / mail already existing
  const takenUserName = await UserSchema.findOne({ username: user.username });
  const takenUserEmail = await UserSchema.findOne({ email: user.email });

  if (takenUserName || takenUserEmail) {
    res.json({ messsage: "username or mail taken" });
  } else {
    user.password = req.body.password; //####
  }

  const dbUser = new UserSchema({
    username: user.username,
    email: user.username,
    password: user.password,
  });
  dbUser.save();
  res.json({ message: "success.." });
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//login

app.post("/login", (req, res) => {
  const userLoggingIn = req.body;

  UserSchema.findOne({ username: userLoggingIn.username }).then((dbUser) => {
    if (!dbUser) {
      return res.json({
        message: "invalid user and password",
      });
    }
    if (userLoggingIn.password === dbUser.password) {
      const payload = { id: dbUser._id, username: dbUser.username };
      const token1 = jwt.sign(payload, "ujuY89", { expiresIn: 80000 });

      return res.json({ message: "success", token: "bearer " + token1 });
    }
  });
});

// app.post("/login",(req, res)=>{

//     // const userLoggingIn =req.body

//     UserSchema.findOne({username:userLoggingIn.username})
//     .then(dbUser=>{
//         if(!dbUser){
//             return res.json({
//                 message:"invalid user and password"
//             })
//         }
//         if(userLoggingIn.password===dbUser.password){
//             const payload ={ id: dbUser._id, username: dbUser.username}
//             jwt.sign(payload, process.env.JWT_SECRET, { expiresIn:80000},
//             (err,token)=>{
//                 if(err) return res.json({message: err})
//                 return res.json({ message: "success", token: "bearer" + token})
//             })
//         } else {
//             return res.json({ message:"invalid username"})
//         }

//     }).catch(error=>console.log(error))

// })

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//verfication of token

function verifyJWT(req, res, next) {
  const token = req.headers["x-access-token"]?.split(" ")[1]; //####

  if (token) {
    jwt.verify(token, "ujuY89", (err, decorded) => {
      if (err)
        return res.json({
          isLoggedIn: false,
          message: "Failed to Authenticate",
        });
      req.user = {};
      req.user.id = decorded.id;
      req.user.username = decorded.username;
      next();
    });
  } else {
    res.json({ message: " Incorrect token given", isLoggedIn: false });
  }
}

app.get("/getUsername", verifyJWT, (req, res) => {
  res.json({ isLoggedIn: true, username: req.user.username });
});

app.listen(PORT, () => {
  console.log("running");
});


//https://dev.to/salarc123/mern-stack-authentication-tutorial-part-2-the-frontend-gen