const express=require('express');
const app=express();
const mongoose = require('mongoose');
const dotenv= require('dotenv');
const bodyParser = require('body-parser');
dotenv.config();
const accountSID = process.env.ACCOUNT_SID;
const port = process.env.PORT || 5000;
const authToken = process.env.AUHT_TOKEN;
const client = require('twilio')(accountSID,authToken);

app.use(bodyParser.urlencoded({extended:false}));
const twilioRoutes = require( './routes/myroutes');

mongoose.connect(
    process.env.DB_CONNECT, { useNewUrlParser:true , useUnifiedTopology: true } , ()=>{
        console.log('Connected to DB');
    }
);


app.use('/twilio',  twilioRoutes);

app.use(express.json());
app.listen(port, ()=> console.log('Server Up. Listening to port 5000'));
