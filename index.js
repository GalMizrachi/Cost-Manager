const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
 // חיפוש שרת תוך 5 שניות
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB", err));

const usersRoutes = require("./routes/users");
const costsRoutes = require("./routes/costs");
const aboutRoutes = require("./routes/about");

app.use("/api/users", usersRoutes);
app.use("/api", costsRoutes);
app.use("/api", aboutRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

