const BlogPost = require("../models/BlogPost");
const mongoose = require("mongoose");

//@desc create a nnew blog post
//@rouute POST /api/posts
//@access private(admin only)
const createPost=async(req,res)=>{
    try{
        const{title, content, coverImageUrl, tags, isDraft, generatedByAI}=req.body;

        const slug=title
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");

        const newPost=new BlogPost({
            title,
            slug,
            content,
            coverImageUrl,
            tags,
            author: req.user._id,
            isDraft,
            generatedByAI,
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch(err){
        res
            .status(500)
            .json({message: "failed to create post", error: err.message});
    }
};

// @desc update an existing blog post
//@route PUT /api/posts/:id
//@access Private (Author or Admin)
const updatePost=async(req, res)=>{
    try{
        
    } catch(err){
        res
            .status(500)
            .json({message: "server error", error: err.message});
    }
};

//@desc delete a blog post
//@route DELETE /api/posts/:id
//@access private (author or admin)
const deletePost=async(req, res)=>{
    try{

    } catch(err){
        res
            .status(500)
            .json({message: "server error", error: err.message});
    }
};

//@desc get a blog post by status (all, published, or draft) and include counts
//@route GET /api/posts?status=published|draft|all&page=1
//@access public
const getAllPosts=async(req, res)=>{
    try{

    } catch(err){
        res
            .status(500)
            .json({message: "server error", error: err.message});
    }
};

//@desc get a blog post by slug
//@route GET/api/posts/:slug
//@access public
const getPostBySlug=async(req, res)=>{
    try{

    } catch(err){
        res
            .status(500)
            .json({message: "server error", error: err.message});
    }
};

//@desc get a blog post by tag
//@route GET /api/tag/:tag
//@access public
const getPostsByTag=async(req, res)=>{
    try{

    } catch(err){
        res
            .status(500)
            .json({message: "server error", error: err.message});
    }
};

//@desc search a blog post by title or content
//@route get /api/posts/search?q=keyword
//@access public
const searchPosts=async(req, res)=>{
    try{

    } catch(err){
        res
            .status(500)
            .json({message: "server error", error: err.message});
    }
};

//@desc increment blog post views count
//@route PUT/api/posts/:id/views
//@access public
const incrementView=async(req, res)=>{
    try{

    } catch(err){
        res
            .status(500)
            .json({message: "server error", error: err.message});
    }
}

//@desc like a blog post
//@route PUT /api/posts/:id/like
//@access public
const likePost=async(req, res)=>{
    try{

    } catch(err){
        res
            .status(500)
            .json({message: "server error", error: err.message});
    }
};

//@desc get all posts of logged-in user
//@route GET /api/posts/trending
//@access private
const getTopPosts=async(req, res)=>{
    try{

    } catch(err){
        res
            .status(500)
            .json({message: "server error", error: err.message});
    }
};

module.exports={
    createPost,
    updatePost,
    deletePost,
    getAllPosts,
    getPostBySlug,
    getPostsByTag,
    searchPosts,
    incrementView,
    likePost,
    getTopPosts,
}