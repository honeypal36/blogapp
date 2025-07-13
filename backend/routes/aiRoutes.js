const express=require("express");
const router=express.Router();
const {protect}=require("../middlewares/authMiddlewares");
const {generateBlogPost, generateBlogPostIdeas, generateCommontReply, generatePostSummary}=require("../controllers/aiController");

router.post("/generate", protect, generateBlogPost);
router.post("/generate-ideas", protect, generateBlogPostIdeas);
router.post("/generate-reply", protect, generateCommontReply);
router.post("/generate-summary", protect, generatePostSummary);

module.exports=router;