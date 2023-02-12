const express = require("express");
const cors = require('cors');


const PORT = process.env.PORT || 3001;
const app = express();

const connection = require('./config/connection');

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Requests
app.use("/users", require("./routes/userRoutes"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});