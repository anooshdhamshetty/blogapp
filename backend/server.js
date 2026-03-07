require("dotenv").config();
const exp = require("express");
const app = exp();

const mongoose = require("mongoose");
const cors = require("cors");

const port_no = process.env.PORT_NO || 4000;
const mongourl = process.env.MONGO_URL;

const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:5174", 
  "http://localhost:3000",
  "https://blogapp-sigma-indol.vercel.app/" // Add your Vercel URL here
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(exp.json());

mongoose.connect(mongourl)
  .then(() => {
    console.log("Database connected successfully...");
    app.listen(port_no, () => {
      console.log("Server running on port", port_no);
    });
  })
  .catch((err) => {
    console.log(err);
  });

const userApp = require("./apis/userApp");
const writerApp = require("./apis/writerApp");

app.use("/userapi", userApp);
app.use("/writerapi", writerApp);
