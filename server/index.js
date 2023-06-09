import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import mongoose from "mongoose";
import cors from "cors"
import multer from "multer";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/ports.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts} from "./data/index.js"

// all the middleware and package config
/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url); // we can use Es module (in package.json type: module) we can use directly import statment to import
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json());

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));


// File Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets") // files are stored inside public/assets
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage }); // we use upload variable at any time when we need to upload/save the file


//ROUTES WITH FILES
app.post("/auth/register", upload.single("picture"), register);

//routes (other routes)
app.use("/auth",authRoutes)
app.use("/users",userRoutes)
app.use("/ports",postRoutes)


//MONGOOSE SETUP in local machine

/*
const PORT = process.env.PORT || 6000; //here 6000 is backup port

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`server runing in Port: ${PORT}`));

    //add data at once
    User.insertMany(users)
    Post.insertMany(posts)
}).catch((error)=>{
    console.log(error)
})
*/

//MONGOOSE SETUP in github codespace

const MONGODB_URL = 'mongodb+srv://vignesh10:vigu123@cluster0.bmz0j.mongodb.net/?retryWrites=true&w=majority'
const PORT = 4000
// const MONGODB_URL = process.env
mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`server runing in Port: ${PORT}`));

    // //add data at once
    User.insertMany(users)
    Post.insertMany(posts)
}).catch((error)=>{
    console.log(error)
})