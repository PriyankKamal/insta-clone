require("dotenv").config();
const express = require("express");
const dbConnection = require("./utils/db");
const router = require("./routers/router");
const cors = require("cors");
const app = express();
const compression = require("compression")
// const session = require("express-session")

app.use(compression());

const passport = require("passport");
const GoogleStratergy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const userModel = require("./models/user.model");

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5050",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const port = process.env.PORT || 2000;

const corsOptions = {
  origin: "http://localhost:5050",
  methods: "POST, GET,PUT,PATCH",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// app.use(session({
//   resave:false,
//   saveUninitialized:false,
//   secret: process.env.SECRET_KEY
// }))

// app.use(passport.initialize());
// app.use(passport.session())

passport.use(
  new GoogleStratergy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let userExist = await userModel.findOne({ googleId: profile.id });
        if (userExist) {
          const token = jwt.sign(
            { userId: userExist._id.toString() },
            process.env.SECRET_KEY
          );
          return done(null, {token: token, user: userExist });
        } else {
          const createUser = await userModel.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            fullname: profile.displayName,
            username: profile.emails[0].value.split("@")[0],
          });
          const token = jwt.sign(
            { userId: createUser._id.toString() },
            process.env.SECRET_KEY
          );
          return done(null, {token: token, user: createUser });
        }
      } catch (error) {
        console.log("Google login error:", error);
        return done(error, null);
      }
    }
  )
);


app.use(passport.initialize());

// passport.serializeUser((userModel,done)=>{
//   done(null,error)
// });
// passport.deserializeUser((userModel,done)=>{
//   done(null,error) 
// });


app.use("/", router);

dbConnection().then(() => {
  server.listen(port, () => {
    console.log(`port is running at ${port} using server`);
  });
});

io.on("connection", (socket) => {
  console.log("a user is connected");

  socket.on("newChat", (data) => {
    console.log("msg data: ", data);
    socket.broadcast.emit("loadNewChat", data);
  });

  //   socket.on("setup", (data) => {
  //     console.log("a user connected: ", data._id);
  //     socket.join(data._id);
  //     socket.emit("connected");
  //   });

  socket.on("disconnect", () => {
    console.log("a user is disconnected");
  });
});

module.exports = app;
