// START PROJECT
const express = require("express")
const app = express()
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const userRoute = require("./routes/user")
const availableRoute = require("./routes/available")
const medicationRoute = require("./routes/medication")
const detailsRoute = require("./routes/details")
const batteryRoute = require("./routes/battery")
const testRoute = require("./routes/test")
const auditRoute = require("./routes/audit")
const deliverRoute = require("./routes/deliver")
 
dotenv.config()
app.use(express.json())

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(console.log("Connected to MongoDB"))
.catch((err) => console.log(err));

app.use("/api/drone", userRoute);
// app.use("/api/drone", availableRoute);
app.use("/api/medication", medicationRoute);
app.use("/api/info", detailsRoute);
app.use("/api/power", batteryRoute);
app.use("/api/test", testRoute);    
app.use("/api/audit", auditRoute);    
app.use("/api/deliver", deliverRoute);    

app.listen("8000", () => {
   console.log("Backend is running") 
})
