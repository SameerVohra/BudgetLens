import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv"

dotenv.config();
const port: number = parseInt(process.env.PORT || "3000");
const dburi: string|undefined = process.env.DB_URL;

mongoose.connect(dburi!)
  .then(()=>console.log("DB Connected Successfully"))
  .catch((error)=>console.log(`Error connecting to DB: ${error}`));

app.listen(port, ()=>{
  console.log(`Listening to ${port}`);
})
