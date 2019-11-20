const router = require('express').Router();
const accountSID = process.env.ACCOUNT_SID;
const authToken = process.env.AUHT_TOKEN;
const surveyModel = require('../models/surveySchema');
const client = require('twilio')(accountSID,authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

router.post('/register' , async (req,res) => {

    let from =  req.body.From;
    let messageBody = req.body.Body
    let survey = await surveyModel.findOne({phoneNo : from });

    if(!survey && messageBody=="START"){
            let currentList = ['Headache', 'Dizziness', 'Nausea', 'Fatigue', 'Sadness'];
            let surveyObject = new surveyModel({
                phoneNo : from,
                symptom : currentList,
                count : "1"

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
    if(survey && messageBody=="START"){
        let currentList = ['Headache', 'Dizziness', 'Nausea', 'Fatigue', 'Sadness'];
        await surveyModel.findOneAndUpdate({phoneNo : from},
            {
                $set:{
                    count : "1",
                    symptom : currentList
            }
        });
        console.log("4");
    }
    switch(survey.count)
    {
      //Enrolled
            case "1":
                    let currentList = survey.symptom;
                    let currentString = "Please indicate your symptom ";
                    for(let i=0;i<currentList.length;i++)
                    {
                        currentString+= "("+(i+1)+")"+ currentList[i] + ", "
                    }
                    currentString+= "(0) None";
                    await client.messages.create({
                        to : from,
                        from : '+19067537001',
                        body : currentString})
                    console.log("5");
                    await surveyModel.findOneAndUpdate({phoneNo : from},
                        {
                            $set:{
                                status : null
                            }
                        });
                    console.log("6");
                    break;

// symptom
            case "2":
                let currentList1 = survey.symptom;
                let symp = currentList1[messageBody-1];
                let currentMap = survey.responseMap;
                currentMap.set(symp, "-1");
                await client.messages.create({
                        to : from,
                        from : '+19067537001',
                        body : "On a scale from 0 (none) to 4 (severe), how would you rate your " + symp + " in the last 24 hours?"});
                await surveyModel.findOneAndUpdate({phoneNo : from},
                        {
                            $set:{
                                    status : "3",
                                    currentResponse: symp,
                                    responseMap : currentMap,
                                    symptom : symp
                            }
                        });
                break;

//scale of symptom
            case "3":
                if(messageBody ==0){

                    await client.messages.create({
                        to : from,
                        from : '+19067537001',
                        body : "You do not have a " + survey.currentResponse});

                    let currentMap = survey.responseMap;
                    currentMap.set(symp, messageBody);

                    await surveyModel.findOneAndUpdate({phoneNo : from},
                    {
                      $set: {
                          status : "3",
                          responseMap: currentMap
                      }
                    });
                    sendSymptomSMS();

                }
              else if(messageBody >=1 && messageBody <=2){
                    await client.messages.create({
                        to : from,
                        from : '+19067537001',
                        body : "You have a mild " + survey.currentResponse});

                    let currentMap = survey.responseMap;
                    currentMap.set(symp, messageBody);

                    await surveyModel.findOneAndUpdate({phoneNo : from},
                    {
                      $set: {
                          status : "3",
                          responseMap: currentMap
                      }
                    });

                    sendSymptomSMS();
                }
              else if(messageBody == 3){
                    await client.messages.create({
                        to : from,
                        from : '+19067537001',
                        body : "You have a moderate " + survey.currentResponse});

                    let currentMap = survey.responseMap;
                    currentMap.set(symp, messageBody);

                    await surveyModel.findOneAndUpdate({phoneNo : from},
                    {
                      $set: {
                          status : "3",
                          responseMap: currentMap
                      }
                    });
                    sendSymptomSMS();
                }
              else if(messageBody == 4){
                    await client.messages.create({
                        to : from,
                        from : '+19067537001',
                        body : "You have a severe " + survey.currentResponse});

                    let currentMap = survey.responseMap;
                    currentMap.set(symp, messageBody);


                    await surveyModel.findOneAndUpdate({phoneNo : from},
                    {
                      $set: {
                          status : "3",
                          responseMap: currentMap
                      }
                    });
                    sendSymptomSMS();
                }
            else {
               await client.messages.create({
                   to: from,
                   from: '+19067537001',
                   body: "Please enter a number from 0 to 4"
               });

           }
           break;
    }
});

async function sendSymptomSMS(){
        symptomList = survey.symptom;
        let currentString = "Please indicate your symptom ";
        for(let i=0;i<currentList.length;i++)
        {
            currentString+= "("+(i+1)+")"+ currentList[i] + ", "
        }
        currentString+= "(0) None";
        await client.messages.create({
            to : from,
            from : '+19067537001',
            body : currentString})
        await surveyModel.findOneAndUpdate({phoneNo : from},
        {
                $set:{
                    status : "2"
                }
        });
    }


module.exports = router;
