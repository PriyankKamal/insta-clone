const express = require("express");
const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const messageModel = require("../models/message.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validate = require("../middleware/validate");
const { signupSchema } = require("../validators/auth-validator");
const { loginSchema } = require("../validators/auth-validator");
const passport = require("passport");
// const passport = require("passport")

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Home page");
});

const isLoggedIn = async (req, res, next) => {
  const authorization = req.header("Authorization");
  // console.log("authorization is:", authorization);
  // if (!authorization) {
  // return res.status(400).json({ error: "you are not log in" });
  // }
  // const token = authorization.replace("Bearer ", "");
  // console.log("req.body is:", req.body);

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(400)
      .json({ error: "Authorization token is missing or malformed" });
  }

  // if(authorization.startsWith("Bearer ")){
  //   const token = authorization.replace("Bearer ", "");
  // }else{

  // }

  const token = authorization.replace("Bearer ", "");
  // console.log("Token received:", token);

  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    // console.log("decide is:", decode);
    const userExist = await userModel.findOne({ _id: decode.userId });
    // console.log(userExist);
    // res.status(200).json(userExist)
    // console.log(userExist);
    req.user = userExist;
    req.token = token;

    return next();
  } catch (error) {
    console.log("isloggedin error", error);
    return res.status(401).json("Invalid token");
  }
};

router.post("/register", validate(signupSchema), async (req, res) => {
  try {
    const { email, fullname, username, password } = req.body;

    if (!(email && fullname && username && password)) {
      return res.status(400).json({ message: "fill all deatails" });
    }
    const salt = 12;
    const hashPassword = await bcrypt.hash(password, salt);

    const userExist = await userModel.findOne({ email });

    if (userExist) {
      return res.status(200).json({ message: "user already exist" });
    }

    const createUser = await userModel.create({
      email,
      fullname,
      username,
      password: hashPassword,
    });

    return res.status(201).json(createUser);
  } catch (error) {
    console.log("registration error: ", error);
  }
});

router.post("/login", validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({ message: "fill all login deatails" });
    }

    const userExist = await userModel.findOne({ email });

    if (!userExist) {
      return res.status(500).json({ message: "email is not exist" });
    }

    const isPasswordMatch = await bcrypt.compare(password, userExist.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "password is not matched" });
    }
    if (isPasswordMatch) {
      const token = jwt.sign(
        {
          userId: userExist._id.toString(),
        },
        process.env.SECRET_KEY
      );
      // console.log({ loginToken: token });
      return res.json({ token: token });
    }

    return res.status(200).json({ message: "user login successfully" });
  } catch (error) {
    console.log("login error: ", error);
  }
});

// goole auth setup route

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }), // Use session: false if not using sessions
  (req, res) => {
    if (req.user) {
      // Successful authentication
      // Assume req.user contains the JWT token
      // console.log("req is: ", req);
      // console.log("rew.user dd: ", req.user);
      const token = req.user.token; // Make sure to send the token from the server-side callback
      return res.redirect(`http://localhost:5050?token=${token}`);
    } else {
      // Authentication failed
      return res.redirect("http://localhost:5050/login");
    }
  }
);

// end of google route setup

router.post("/createpost", isLoggedIn, async (req, res) => {
  try {
    const { caption, photo } = req.body;

    // console.log(_id);
    // console.log(req.body);
    // console.log(req.user);
    if (!caption) {
      return res.status(400).json({ cretepost: "fill all details" });
    }
    const createPost = await postModel.create({
      caption: caption,
      photo: photo,
      postedBy: req.user._id,
      // photo
    });
    // console.log("posted by: ",postedBy);
    const userExist = await userModel.findOne({ _id: req.user._id });
    userExist.posts.push(createPost._id);
    await userExist.save();
    return res.json(createPost);
  } catch (error) {
    console.log("createpost error: ", error);
    return res.status(400).json({ createPostError: error });
  }
});

router.get("/allposts", isLoggedIn, async (req, res) => {
  try {
    const allposts = await postModel.find().populate("postedBy");
    res.status(200).json(allposts);
    //    res.send(allposts)
  } catch (error) {
    console.log("find all posts error:", error);
  }
});

router.get("/findloggedinuserposts", isLoggedIn, async (req, res) => {
  try {
    const alluserposts = await req.user;
    // console.log(alluserposts);
    const userExist = await userModel
      .findOne({ email: req.user.email })
      .populate("posts");

    res.json(userExist);
  } catch (error) {
    console.log("findloggedinuserposts error:", error);
  }
});

router.put("/uploadPhoto", isLoggedIn, isLoggedIn, async (req, res) => {
  try {
    const { _id } = req.user;
    const { profilephoto } = req.body;
    const userExist = await userModel.findById(_id);
    if (!userExist) {
      return res.status(404).json({ error: "User not found" });
    }
    // console.log(userExist);
    userExist.profilepic = profilephoto;
    // await userExist.save()
    const updatedUser = await userExist.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("upload photo error backend:", error);
  }
});

router.get("/findalluser", isLoggedIn, async (req, res) => {
  // console.log("find all user", req.user._id.toString());
  const userExist = await userModel.find({ _id: { $ne: req.user._id } });
  // console.log(userExist);
  // res.send(userExist);
  return res.json(userExist);
});

router.put("/comment", isLoggedIn, async (req, res) => {
  try {
    // console.log("req.body is",req.body);
    const postId = req.body.postedId;
    const comment = {
      comment: req.body.comment,
      postedBy: req.user._id,
    };
    const createdComment = await postModel
      .findByIdAndUpdate(
        postId,
        {
          $push: { comments: comment },
        },
        {
          new: true,
        }
      )
      .populate("postedBy")
      .populate("comments.postedBy");

    // console.log("comment data is in backend",comment);
    res.json(createdComment);
  } catch (error) {
    console.log("comment error", error);
  }
});

router.get("/user", isLoggedIn, async (req, res) => {
  try {
    const userData = req.user;
    // console.log("user router userdata is:", userData);
    res.status(200).json(userData);
  } catch (error) {
    console.log("user route error");
    res.status(400).json(error);
  }
});

router.post("/delete", isLoggedIn, async (req, res) => {
  try {
    const { postid } = req.body;
    console.log("req.body: ",req.body)
    // Delete the post from the post collection
    const delPost = await postModel.findOneAndDelete({ _id: postid });

    // If the post was deleted, also remove its reference from the user's posts array
    if (delPost) {
      await userModel.updateOne(
        { _id: req.user._id },
        { $pull: { posts: postid } }
      );
    }

    return res
      .status(200)
      .json({ message: "Post deleted successfully." });
  } catch (error) {
    console.log("delete post error: ", error);
    return res
      .status(400)
      .json({ message: "SERVER error! Post can't be deleted" });
  }
});




router.get("/user/:id", isLoggedIn, async (req, res) => {
  try {
    // console.log("req.params is:", req.params);
    // console.log(typeof req.params.id);
    const id = req.params.id;
    // console.log("userId is:", id);
    const verifiedUser = await userModel
      .findOne({ _id: id })
      .select("-password")
      .populate("posts");
    return res.status(200).json(verifiedUser);
  } catch (error) {
    console.log("/user/:id error", error);
    return res.status(400).json({ error: error.message });
  }
});

router.put("/follow", isLoggedIn, async (req, res) => {
  try {
    // Update the follower
    const updatedUser = await userModel.findByIdAndUpdate(
      req.body.followId,
      {
        $push: { followers: req.user._id },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "User not found" });
    }

    // Update the following
    const currentUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        $push: { following: req.body.followId },
      },
      { new: true }
    );

    return res.status(200).json(currentUser);
  } catch (err) {
    return res.status(400).json({ message: err });
  }
});

router.put("/unfollow", isLoggedIn, async (req, res) => {
  try {
    // Update the follower
    const updatedUser = await userModel.findByIdAndUpdate(
      req.body.followId,
      {
        $pull: { followers: req.user._id },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "User not found" });
    }

    // Update the following
    const currentUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body.followId },
      },
      { new: true }
    );

    return res.status(200).json(currentUser);
  } catch (err) {
    return res.status(400).json({ message: err });
  }
});

router.post("/messageuser/:id", isLoggedIn, async (req, res) => {
  try {
    if (req.body.message !== "") {
      const userId = req.params.id;
      const loggedinUser = req.user;

      const message = await messageModel.create({
        text: req.body.message,
        sender: loggedinUser._id,
        receiver: userId,
      });

      const userExist = await userModel.findOne({ _id: loggedinUser._id });
      userExist.chats.push(message);
      await userExist.save();

      console.log("msg data: ", message);

      return res.status(201).json(message);
    }
    return res.status(500).json("no message enter");
  } catch (error) {
    console.log("message user id error: ", error);
  }
});

router.get("/messageuser/:id", isLoggedIn, async (req, res) => {
  try {
    const userId = req.params.id;
    const loggedinUser = req.user;

    // const receiverUser = await userModel.findOne

    const userExist = await userModel
      .findOne({ _id: loggedinUser._id })
      .populate({
        path: "chats",
        match: { sender: loggedinUser._id, receiver: userId },
      });

    const chatExist = await messageModel.find({
      sender: userId,
      receiver: loggedinUser._id,
    });
    return res.status(200).json({ userExist, chatExist });
  } catch (error) {
    console.log("message:id in get error: ", error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const userExist = await userModel.findOne({ _id: id });

    return res.status(200).json(userExist);
  } catch (error) {
    console.log("/userdtls/:id error", error);
  }
});


// router.post("/likes", isLoggedIn,async (req, res) => {
//   try {
//     let postId = req.body.postId;
//     const postExist = await postModel.findOne({ _id: postId });

//     if (postExist) {
//       postExist.likes += 1;
//       await postExist.save(); 
//       return res.status(200).json(postExist); 
//     } else {
//       return res.status(404).json({ message: "Post not found" });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: "Internal Server Error", error });
//   }
// });

// router.post("/unlikes", isLoggedIn,async (req, res) => {
//   try {
//     let postId = req.body.postId;
//     const postExist = await postModel.findOne({ _id: postId });

//     if (postExist) {
//       postExist.likes -= 1;
//       await postExist.save(); // Save the updated post to the database
//       return res.status(200).json(postExist); // Return the updated post
//     } else {
//       return res.status(404).json({ message: "Post not found" });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: "Internal Server Error", error });
//   }
// });

module.exports = router;
