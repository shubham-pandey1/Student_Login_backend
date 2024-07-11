const express = require('express');
const router = express.Router();
const User = require('../model/User');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const JWT_SECRET = "ShubhamisGoodB$oy";
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser")



// create a user using a post '/api/auth/crateuser'. no login requird
router.post('/createuser',[
    body('name','Enter valid name').isLength({min: 3}),
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Entered password is shorter').isLength({min: 5})
],async(req,res)=>{
    
        let success = false;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({success,errors: errors.array()});
        } else{ 
            console.log(req.body);
        }
        // check wheather the user with this email exists already

        try{
        let user = await User.findOne({email: req.body.email});
        console.log(user)
        if(user){
            return res.status(400).json({success, error: "Sorry a user with this email is alrady exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
            
        });
        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success,authtoken});
    }
        catch(error){
            console.error(error.message);
            res.status(500).send(success, "Some error occured");
        }

        
})

// Authenticate a user using: post "/api/auth/login". no login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
  
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
  
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ success: true, authtoken: token });
  
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });
  

// Route 3: Get logedin detail of user Post: "/api/auth/getuser". login required
router.post('/getuser',fetchuser, async(req,res)=>{
try{
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
}catch(error){
    console.error(error.message);
    res.status(500).send("Internal server error");
}
})


module.exports = router