const mongoose = require('mongoose');

mongoose.connect(process.env.ATLAS_DB_URL)
.then( () => console.log("Connected to MyMongoDB") )
.catch( (err) => console.error("Failed to connect to MyMongoDB", err) );

module.exports = mongoose