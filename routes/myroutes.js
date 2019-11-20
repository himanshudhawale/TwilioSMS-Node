const router = require('express').Router();
const accountSID = process.env.ACCOUNT_SID;
const surveyModel = require('../models/surveySchema');
const authToken = process.env.AUHT_TOKEN;
const client = require('twilio')(accountSID,authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

router.post('/register' , async (req,res) => {

    console.log("IN RESGISTER");
    let from =  req.body.From;
    let msgBody = req.body.Body;

    let survey = await surveyModel.findOne({phoneNo : from });
    if(!survey && msgBody=="START"){
            let symptomList = ['Headache', 'Dizziness', 'Nausea', 'Fatigue', 'Sadness'];
            let surveyObject = new surveyModel({
                phoneNo : from,
                symptoms : symptomList,
                status : "Enrolled"

            })
            console.log("1");
            await client.messages.create({
                to : from,
                from : '+19067537001',
                body : 'Welcome to the study',})
            console.log("2");
            survey = await surveyObject.save();
            console.log("3");
    }
    if(survey && msgBody=="START"){
        let symptomList = ['Headache', 'Dizziness', 'Nausea', 'Fatigue', 'Sadness'];
        await surveyObject.findOneAndUpdate({phoneNo : from},
            {
                $set:{
                    status : "Enrolled",
                    symptoms : symptomList
            }
        });
        console.log("4");
    }
    switch(survey.status)
    {
            case "Enrolled":
                    let symptomList = survey.symptom;
                    let symptString = "Please indicate your symptom ";
                    for(let i=0;i<symptomList.length;i++)
                    {
                        symptString+= "("+(i+1)+")"+ symptomList[i] + ", "
                    }
                    symptString+= "(0) None";
                    await client.messages.create({
                        to : from,
                        from : '+19067537001',
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
                let symptomList = survey.symptom;
                let symp = symptomList[msgBody-1];
                await client.messages.create({
                        to : from,
                        from : '+19067537001',
                        body : "On a scale from 0 (none) to 4 (severe), how would you rate your " + symp + " in the last 24 hours?"});
                await surveyObject.findOneAndUpdate({phoneNo : from},
                        {
                            $set:{
                                    status : "AwaitingScale",
                                    response1 : symp,
                                    symptoms : symp
                            }
                        });
                break;

    }
});


module.exports = router;
