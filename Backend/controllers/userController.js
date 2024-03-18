const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const User = require("../models/user");


const postSignup = async (req, res) => {
    try {
      console.log(req.body);
      const Existuser = await User.findOne({ email: req.body.email });
      if (Existuser) {
        return res.json({ error: "user already exists" });
      } else {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
  
        const hashedPassword = await bcrypt.hash(req.body.Password, salt);
  
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          role: "user",
          password: hashedPassword,
          profile: "./src/assets/profileimg.jpg",
        });
  
        const savedUser = await newUser.save();
        const JWT_SECRET = process.env.JWT_SECRET;
        const token = jwt.sign({ user: savedUser._id }, JWT_SECRET);
  
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
          sameSite: 'none',
          secure: true 
      }).json({ success: true });
      
      }
    } catch (error) {
      console.error("error while signup:", error);
    }
  };

  const fetchData = async (req, res) => {
    try {

      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ error: "Unauthorized1" });
      }
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) {
        return res.status(401).json({ error: "Unauthorized2" });
      }
      const data = await User.findById(verified.user);
      if (!data) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({data});
    } catch (error) {
      console.error("error while fetch data:", error);
    }
  };
  const login = async (req, res) => {
    try {
      console.log(req.body,'++++++')
      const existingUser = await User.findOne({ email: req.body.email });
      console.log(existingUser,'==>')
      if (!existingUser) {
        console.log("User not found")
        return res.json({ emailerr: "User not found" });
      }
  
      const passwordCorrect =await bcrypt.compare(
        req.body.password,
        existingUser.password
      );
  
      if (!passwordCorrect) {
        console.log("Password incoorect")
        return res.json({ passworderr: "Wrong password" });
      } else {
        console.log("user sended")
        const token = jwt.sign(
          {
            user: existingUser._id,
          },
          process.env.JWT_SECRET,{
            expiresIn:"30d"
          }
        );
  
        res
          .cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: 'none',
            secure: true 
          })

          res.json({ success: true });
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  const logout = (req, res) => {
    res.clearCookie("token").send({ something: "here" });
  };
  const editprofile = async (req, res) => {
    try {
      const name = req.body.data.name;
      const currentPassword = req.body.currentpassword;
      const newPassword = req.body.newpassword;     
      const user = await User.findOne({email: req.body.data.email });  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const passwordCorrect = await bcrypt.compare(currentPassword, user.password);
      if (passwordCorrect) {
        const salt = await bcrypt.genSalt(10);
        const hashedNewPass = await bcrypt.hash(newPassword, salt);
        const updateFields = { name, password: hashedNewPass };
        await User.updateOne({ _id: req.body._id }, { $set: updateFields });
        console.log("SUCCESFULL")
        return res.json({ success: true });
      } else {
        console.log('INCORRECT PASSWORD')
        return res.status(401).json({ error: "Incorrect password" });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  
  //upload image
  const uploadImage = async (req, res) => {
    try {
      const token = req.cookies.token;
      console.log(token,"TOKEN+++++")
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ _id: verified.user });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
     
      const imageUrl = user.profile;
      console.log(imageUrl,"imageurl");
  
      if (imageUrl !== "./src/assets/profileimg.jpg") {
        console.log("2345678");
        const parsedUrl = new URL(imageUrl);
        console.log(parsedUrl,"parseUrl");
        const imageName = path.basename(parsedUrl.pathname);
        console.log(imageName,"imageName");
        const folderPath = './public';
        const imagePath = path.join(folderPath, imageName);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`${imageName} has been deleted successfully.`);
        } else {
            console.log(`${imageName} does not exist in the folder.`);
        }
    }
    const path_image = process.env.IMAGE_PATH + `profileimages/${req.file.filename}`
    console.log("NEW PATH IMAGE",path_image)
    const data = await User.updateOne({ _id: verified.user }, { $set: { profile: path_image } });
    res.json(data)
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  module.exports={
    postSignup,
    fetchData ,
    login ,
    logout,
    uploadImage,
    editprofile
  }