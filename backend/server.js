require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const blogPostRoutes = require("./routes/blogPostRoutes");
// const commentRoutes = require("./routes/commentRoutes");
// const dashboardRoutes = require("./routes/dashboardRoutes");
// const aiRoutes = require("./routes/aiRoutes");

const app = express();

//middleware to handle cors
app.use(
   cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
   }) 
);

//conenctdb
connectDB();

//middleware
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", blogPostRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/dashboard-summary", dashboardRoutes);

// app.use("/api/ai", aiRoutes);

//serve upload folder
app.use("/upload", express.static(path.join(__dirname, "uploads"), {}));

//start server
const PORT=process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`server is running on port ${PORT}`));
