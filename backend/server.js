import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import cors from "cors";
import listingRouter from "./routes/listingRouter.js";

const app =express()

dotenv.config();

app.use(
    cors(
        {
            origin:["http://localhost:3000",process.env.FRONTEND_URL],
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
            allowedHeaders: ["Content-Type", "Authorization"],
        }
    )
)

//add middlwears
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//test route
app.get("/",(req,res)=>{
    res.send("Hello World")
})

//routers
app.use("/api/users",userRouter)
app.use("/api/listings",listingRouter)

//get port
const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database", error);
  });