const express = require("express");
const cors = require('cors');
const path = require('path');


const PORT = process.env.PORT || 3001;
const app = express();

const connection = require('./server/config/connection');

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Requests
app.use("/users", require("./server/routes/userRoutes"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Condition for production 
app.use(express.static("client"));
app.get("/users", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "index.html"));
});
