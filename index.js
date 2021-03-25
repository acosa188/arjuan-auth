const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Importing Routers
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

// Adding config file
dotenv.config();

// Connect to DB
mongoose.connect(
process.env.DB_CONNECT,
{ useUnifiedTopology: true },
()=>{
    console.log("connected to database")
});

// Middlewares
app.use(express.json());
app.use(cors());

// Route middlewares
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(port, ()=>{
    console.log(`Server is up on port ${port}`);
});