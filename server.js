const app = require('./app');

//importing dotenv 
const dotenv = require('dotenv');

//configuring dotenv
dotenv.config();

//port from .env file
const port = process.env.PORT || 5000;

// running port
app.listen(port, ()=>{
    console.log(`connected to port ${port}`);
})

module.exports=app;