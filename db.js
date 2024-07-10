
const mongoose = require('mongoose');
const db = process.env.REACT_APP_MONGOURI; 
const mongoURI = db||"mongodb://localhost:27017/";



main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(db);
  
  console.log('connected successfully'); 
  
}

module.exports = main;