const router = require('express').Router();
const accountSID = process.env.ACCOUNT_SID;
const authToken = process.env.AUHT_TOKEN;
const surveyModel = require('../models/surveySchema');
const client = require('twilio')(accountSID,authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

router.post('/register' , async (req,res) => {

    let from =  req.body.From;
    let msgBody = req.body.Body;

    let survey = await surveyModel.findOne({phoneNo : from });
    if(!survey && msgBody=="START"){
            let symptomKiList = ['Headache', 'Dizziness', 'Nausea', 'Fatigue', 'Sadness'];
            let surveyObject = new surveyModel({
                phoneNo : from,
                symptoms : symptomKiList,
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
        let symptomKiList = ['Headache', 'Dizziness', 'Nausea', 'Fatigue', 'Sadness'];
        await surveyModel.findOneAndUpdate({phoneNo : from},
            {
                $set:{
                    status : "Enrolled",
                    symptoms : symptomKiList
            }
        });
        console.log("4");
    }
    switch(survey.status)
    {
            case "Enrolled":
                    let symptomKiList = survey.symptom;
                    let symptString = "Please indicate your symptom ";
                    for(let i=0;i<symptomKiList.length;i++)
                    {
                        symptString+= "("+(i+1)+")"+ symptomKiList[i] + ", "
                    }
                    symptString+= "(0) None";
                    await client.messages.create({
                        to : from,
                        from : '+19067537001',
                        body : symptString})
                    console.log("5");
                    await surveyModel.findOneAndUpdate({phoneNo : from},
                        {
                            $set:{
                                status : "AwaitingSymptom"
                            }
                        });
                    console.log("6");
                    break;


            case "AwaitingSymptom":
                let symptomKiList1 = survey.symptom;
                let symp = symptomKiList1[msgBody-1];
                await client.messages.create({
                        to : from,
                        from : '+19067537001',
                        body : "On a scale from 0 (none) to 4 (severe), how would you rate your " + symp + " in the last 24 hours?"});
                await surveyModel.findOneAndUpdate({phoneNo : from},
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
