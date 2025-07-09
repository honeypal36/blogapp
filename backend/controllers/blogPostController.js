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
       const post=await BlogPost.findById(req.params.id);
       if(!post) return res.status(404).json({message: "post not found"}); 

       if(
        post.author.toString()!==req.user._id.toString()&&
        !req.user.isAdmin
       ){
        return res
            .status(403)
            .json({message: "not authorised to update this post"});
       }

       const updatedData = req.body;
        if (updatedData.title) {
        updatedData.slug = updatedData.title
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g,"");
        }

        const updatedPost = await BlogPost.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );
        res.json(updatedPost);
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
        const post=await BlogPost.findById(req.params.id);
        if(!post) return res.status(404).json({message: "Post not found"});

        await post.deleteOne();
        res.json({message: "Post deleted"});
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
        const status=req.query.status || "published";
        const page=parseInt(req.query.page) || 1;
        const limit=5;
        const skip=(page-1)*limit;

        //determine filter for main post response
        let filter={};
        if(status=="published") filter.isDraft=false;
        else if (status=="draft") filter.isDraft=true;

        //fetch paginated post
        const posts=await BlogPost.find(filter)
            .populate("author","name profileImageUrl")
            .sort({updateedAt: -1})
            .skip(skip)
            .limit(limit);
        
        //count totals pagination and post counts
        const [totalCount, allCount, publishedCount, draftCount] = await Promise.all([
            BlogPost.countDocuments(filter), // for pagination of current tab
            BlogPost.countDocuments(),
            BlogPost.countDocuments({ isDraft: false }),
            BlogPost.countDocuments({ isDraft: true }),
        ]);

        res.json({
            posts,
            page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            counts: {
                all: allCount,
                published: publishedCount,
                draft: draftCount,
            }
        });
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
        const post = await BlogPost.findOne({ slug: req.params.slug }).populate(
            "author",
            "name profileImageUrl"
        );

        if (!post) return res.status(404).json({ message: "Post not found" });
        res.json(post);
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
        const posts = await BlogPost.find({
            tags: req.params. tag,
            isDraft: false,
        }).populate("author", "name profileImageUrl");
        res.json(posts);
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
        const q = req.query.q;
        const posts = await BlogPost.find({
            isDraft: false,
            $or: [
                { title: { $regex: q, $options: "i" } },
                { content: { $regex: q, $options: "i" } },
            ],
        }).populate("author", "name profileImageUrl");
        res.json(posts);

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
       await BlogPost.findByIdAndUpdate(req.params.id, {$inc: {view: 1}}); 
       res.json({message: "View count incremented"});
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
        await BlogPost.findByIdAndUpdate(req.params.id, {$inc: {likes: 1}}); 
       res.json({message: "like added"});
    } catch(err){
        res
            .status(500)
            .json({message: "server error", error: err.message});
    }
};

//@desc get top trending post
//@route GET /api/posts/trending
//@access private
const getTopPosts=async(req, res)=>{
    try{
        // Top performing posts
        const posts = await BlogPost.find({ isDraft: false })
            .sort({ views: -1, likes: -1 })
            .limit(5);

        res.json(posts);
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