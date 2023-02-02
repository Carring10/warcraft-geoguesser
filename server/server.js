const express = require("express");

const PORT = process.env.PORT || 3001;
const app = express();

const connection = require('./config/connection');

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Requests
app.use("/users", require("./routes/userRoutes"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});