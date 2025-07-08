const User=require("../models/User");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

//generate jwt token
const generateToken=(userId)=>{
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: "7d"});
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser=async(req,res)=>{
    try{
        const { name, email, password, profileImageUrl, bio, adminAccessToken }=req.body;
        let role = "member";
        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: "User already exists"});
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        //determine user role: admin if correct token is provided else member
        if(
            adminAccessToken &&
            adminAccessToken==process.env.ADMIN_ACCESS_TOKEN
        ){
            role = "admin";
        }

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            bio,
            role,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            bio: user.bio,
            role,
            token: generateToken(user._id),
        });
    }catch(error){
        res.status(500).json({message: "Server error", error: error.message});
    }
};

//@desc login user
//@route POST /api/auth/Login
//@access Public
const loginUser=async(req,res)=>{
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(500).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(500).json({ message: "Invalid email or password" });
        }

        //return user data with jwt
        res.json({
             _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            bio: user.bio,
            role: user.role,
            token: generateToken(user._id),
        });
    }catch(error){
        res.status(500).json({message: "Server error", error: error.message});
    }
}

//@desc get user profile
//@route get /api/auth/profile
//@access private(require jwt)
const getUserProfile=async(req, res)=>{
    try{
        const user=await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message: "user not found"})
        }
        res.json(user);
    } catch (error){
        res.status(500).json({message: "server error", error: error.message});
    }
};

module.exports={ registerUser, loginUser, getUserProfile };