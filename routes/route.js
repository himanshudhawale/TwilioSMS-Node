const router = require('express').Router();
const accountSID = process.env.TWILIO_ACCOUNT_SID;
const phoneModel = require('../model/phone');
const authToken = process.env.TWILIO_AUHT_TOKEN;
const client = require('twilio')(accountSID,authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

router.post('/register' , async (req,res) => {

    let from =  req.body.From;
    let to = req.body.To;
    let msgBody = req.body.Body;
    console.log("FROM " + from);
    console.log("TO " + to);
    console.log("BODY " + msgBody);
    let phone = await phoneModel.findOne({phoneNo : from });
    if(phone)
    {
        res.send({
            "result" : "yes",
            "phone" : phone
        })
    }
    else
    {
        let phoneObj = new phoneModel({
            phoneNo : from
        })
        phone = await phoneObj.save();
        res.send({
            "result" : "No",
            "phone" : phone
        })
    }



});

module.exports = router;
