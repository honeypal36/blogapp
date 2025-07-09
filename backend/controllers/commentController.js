const Comment=require("../models/Comment");
const   BlogPost=require("../models/BlogPost")

const addComment=async(req, res)=>{
    try{
        const { postId } = req.params;
        const { content, parentComment } = req.body;

        // Ensure blog post exists
        const post = await BlogPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = await Comment.create({
            post: postId,
            author: req.user._id,
            content,
            parentComment: parentComment || null,
        });

        await comment.populate("author", "name profileImageUrl");

        res.status(201). json(comment);
    } catch(error){
        res
            .status(500)
            .json({ message: "failed to add comment", error: error.message});
    }
};

const getAllComments=async(req, res)=>{
    try{
        // Fetch all comments with author populated
        const comments = await Comment. find()
            .populate("author", "name profileImageUrl")
            .populate("post", "title coverImageUrl")
            .sort({ createdAt: 1 }) // optional, so replies come in order

        // Create a map for commentId -> comment object
        const commentMap = {};
        comments.forEach(comment => {
            comment = comment.toObject(); // convert from Mongoose Document to plain object
            comment.replies = []; // initialize replies array
            commentMap[comment ._id] = comment;
        });

        // Nest replies under their parentComment
        const nestedComments = [];
        comments.forEach(comment => {
        if (comment.parentComment) {
            const parent = commentMap[comment.parentComment];
            if (parent) {
                parent.replies.push(commentMap[comment ._id] );
            }
        }
        else {
            nestedComments.push(commentMap [comment ._id] );
        }
    });

    res.json(nestedComments);
    } catch(error){
        res
            .status(500)
            .json({ message: "failed to fetch all comment", error: error.message});
    }
};

const getCommentsByPost=async(req, res)=>{
    try{
          const { postId } = req.params;

            const comments = await Comment.find({ post: postId })
                .populate("author", "name profileImageUrl")
                .populate("post", "title coverImageUrl")
                .sort({ createdAt: 1 }) // optional, so replies come in order

            // Create a map for commentId -> comment object
            const commentMap = {};
                comments.forEach(comment => {
                comment = comment. toObject(); // convert from Mongoose Document to plain object
                comment.replies = []; // initialize replies array
                commentMap [comment ._id] = comment;
            });
            // Nest replies under their parentComment
            const nestedComments = [];
            comments.forEach(comment => {
            if (comment.parentComment) {
                const parent = commentMap[comment.parentComment];
                if (parent) {
                    parent.replies.push(commentMap[comment._id]);
                }

            } else {
                nestedComments.push(commentMap[comment._id]);

            }
            });

            res.json(nestedComments);
    } catch(error){
        res
            .status(500)
            .json({ message: "failed to fetch comments", error: error.message});
    }
};

const deleteComment=async(req, res)=>{
    try{
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });

        }

        // Delete the comment
        await Comment.deleteOne({ _id: commentId });

        // Delete all replies to this comment (one level of nesting only)
        await Comment.deleteMany({ parentComment: commentId });

        res.json({ message: "Comment and any replies deleted successfully" });
    } catch(error){
        res
            .status(500)
            .json({ message: "failed to delete comment", error: error.message});
    }
};

module.exports={
    addComment,
    getCommentsByPost,
    deleteComment,
    getAllComments
};