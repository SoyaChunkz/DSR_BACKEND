require("dotenv").config();
const express = require("express")
const cors = require("cors");
const mongoose = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const dsrRoutes = require("./routes/dsrRoutes");
const pdfMailRoutes = require("./routes/pdfMailRoutes");
const departmentPanelRoutes = require("./routes/departmentPanelRoutes");
const userPanelRoutes = require("./routes/userPanelRoutes");

const app = express();
app.use(express.json());

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }));

app.use('/api/users', userRoutes);
app.use('/api/dsr', dsrRoutes);
app.use('/api/pdf-mail', pdfMailRoutes);
app.use('/api/department', departmentPanelRoutes)
app.use('/api/user', userPanelRoutes)

app.get('/', (req, res) => {
    res.json({
        data: "server is active"
    })
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`)
});