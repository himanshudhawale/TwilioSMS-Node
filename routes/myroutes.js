const router = require('express').Router();
const accountSID = process.env.ACCOUNT_SID;
const surveyObject = require('../models/surveySchema');
const authToken = process.env.AUHT_TOKEN;
const client = require('twilio')(accountSID,authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

router.post('/register' , async (req,res) => {

    console.log("IN RESGISTER");
    let from =  req.body.From;
    let msgBody = req.body.Body;

    let phone = await surveyObject.findOne({phoneNo : from });
    if(!phone && msgBody=="START"){
            let symptomList = ['Headache', 'Dizziness', 'Nausea', 'Fatigue', 'Sadness'];
            let phoneObj = new surveyObject({
                phoneNo : from,
                status : "Registered",
                symptoms : symptomList

            })
            console.log("1");
            await client.messages.create({
                to : from,
                from : process.env.TWILIO_PHONE_NO,
                body : 'Welcome to the study',})
            console.log("2");
            phone = await phoneObj.save();
            console.log("3");
    }
    if(phone && msgBody=="START"){
        let symptomList = ['Headache', 'Dizziness', 'Nausea', 'Fatigue', 'Sadness'];
        await surveyObject.findOneAndUpdate({phoneNo : from},
            {
                $set:{
                    status : "Registered",
                    symptoms : symptomList
            }
        });
        console.log("4");
    }
    switch(phone.status)
    {
            case "Registered":
                    let symptomList = phone.symptoms;
                    let symptString = "Please indicate your symptom ";
                    for(let i=0;i<symptomList.length;i++)
                    {
                        symptString+= "("+(i+1)+")"+ symptomList[i] + ", "
                    }
                    symptString+= "(0) None";
                    await client.messages.create({
                        to : from,
                        from : process.env.TWILIO_PHONE_NO,
                        body : symptString})
                    console.log("5");
                    await surveyObject.findOneAndUpdate({phoneNo : from},
                        {
                            $set:{
                                status : "AwaitingSymptom"
                            }
                        });
                    console.log("6");
                    break;


            case "AwaitingSymptom":
                let symptomList = phone.symptoms;
                let symp = symptomList[msgBody-1];
                await client.messages.create({
                        to : from,
                        from : process.env.TWILIO_PHONE_NO,
                        body : "On a scale from 0 (none) to 4 (severe), how would you rate your " + symp + " in the last 24 hours?"});
                await surveyObject.findOneAndUpdate({phoneNo : from},
                        {
                            $set:{
                                    status : "AwaitingScale",
                                    currentSymptom : symp,
                                    symptoms : symp
                            }
                        });
                break;

    }
});




module.exports = router;
