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
            sendSymptomSMS();
    }
    // if(survey && messageBody=="START"){
    //     let currentList = ['Headache', 'Dizziness', 'Nausea', 'Fatigue', 'Sadness'];
    //     await surveyModel.findOneAndUpdate({phoneNo : from},
    //         {
    //             $set:{
    //                 count : "1",
    //                 symptom : currentList
    //         }
    //     });
    //     console.log("4");
    // }


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
        sendSymptomSMS();
        // currentList = survey.symptom;
        // if(currentList.length<=2)
        // {
        //     await client.messages.create({
        //     to: from,
        //     from: '+19067537001',
        //     body: "Thank you and see you soon"
        //    });
        //
        //   await surveyModel.findOneAndUpdate({ phoneNo: from },
        //   {
        //       $set: {
        //          count: null
        //       }
        //   });
        //
        // }
        //   let currentString = "Please indicate your symptom ";
        //   for(let i=0;i<currentList.length;i++)
        //     {
        //         currentString+= "("+(i+1)+")"+ currentList[i] + ", "
        //     }
        //     currentString+= "(0) None";
        //     await client.messages.create({
        //         to : from,
        //         from : '+19067537001',
        //         body : currentString})
        //     console.log("5");
        //     // let currentMap = survey.responseMap;
        //     //
        //     // let symp = currentList[messageBody - 1];
        //     //
        //     // currentMap.set(symp, "-1");
        //
        //     // var ss = currentList.filter(e => e !== symp);
        //
        //     await surveyModel.findOneAndUpdate({phoneNo : from},
        //       {
        //           $set:{
        //               count : "2"
        //           }
        //       });
        //     console.log("6");
    }


    switch(survey.count)
    {
      //Enrolled
            // case "1":

                    // let currentList = survey.symptom;
                    // if(currentList.length<=2)
                    // {
                    //     await client.messages.create({
                    //         to: from,
                    //         from: '+19067537001',
                    //         body: "Thank you and see you soon"
                    //     });
                    //     // await client.messages.create({
                    //     //     to : from,
                    //     //     from : '+19067537001',
                    //     //     body : currentString})
                    //     // console.log("5");
                    //     await surveyModel.findOneAndUpdate({ phoneNo: from },
                    //         {
                    //             $set: {
                    //                 count: null
                    //             }
                    //     });
                    //
                    // }
                    // let currentString = "Please indicate your symptom ";
                    // for(let i=0;i<currentList.length;i++)
                    // {
                    //     currentString+= "("+(i+1)+")"+ currentList[i] + ", "
                    // }
                    // currentString+= "(0) None";
                    // await client.messages.create({
                    //     to : from,
                    //     from : '+19067537001',
                    //     body : currentString})
                    // console.log("5");
                    // await surveyModel.findOneAndUpdate({phoneNo : from},
                    //     {
                    //         $set:{
                    //             count : "2"
                    //
                    //         }
                    //     });
                    // console.log("6");
                    // break;

// symptom
            case "2":
                let currentList1 = survey.symptom;
                // let symp = currentList1[messageBody-1];
                let currentMap = survey.responseMap;
                // currentMap.set(symp, "-1");
                // let ss = currentList1.filter(e => e !== symp);

                if (messageBody == 0) {
                await client.messages.create({
                  to: from,
                  from: '+19067537001',
                  body: "Thank you and we will check with you later."
                });
                await surveyModel.findOneAndUpdate({ phoneNo: from },
                  {
                      $set: {
                          count: null
                      }
                  });

                }
                else if (messageBody > 0 && messageBody <= currentList1.length) {
                    let symp = currentList1[messageBody - 1];
                    currentMap.set(symp, "-1");

                    await client.messages.create({
                        to: from,
                        from: '+19067537001',
                        body: "On a scale from 0 (none) to 4 (severe), how would you rate your " + symp + " in the last 24 hours?"
                    });
                    var ss = currentList1.filter(e => e !== symp);
                    await surveyModel.findOneAndUpdate({ phoneNo: from },
                        {
                            $set: {
                                count: "3",
                                currentResponse: symp,
                                symptom: ss,
                                responseMap: currentMap
                            }
                        });
                }
                else {
                    await client.messages.create({
                        to: from,
                        from: '+19067537001',
                        body: "Please enter a number from 0 to " + currentList1.length
                    });
                }
                // let symp = currentList1[messageBody-1];
                //
                // await surveyModel.findOneAndUpdate({phoneNo : from},
                //         {
                //             $set:{
                //                     count : "3",
                //                     currentResponse: symp,
                //                     responseMap : currentMap,
                //                     symptom : ss
                //             }
                //         });
                break;

//scale of symptom
            case "3":
            //do not have
                if(messageBody ==0){

                    await client.messages.create({
                        to : from,
                        from : '+19067537001',
                        body : "You do not have a " + survey.currentResponse});



                    sendSymptomSMS2();

                }
                //mild
                else if(messageBody >=1 && messageBody <=2){
                    await client.messages.create({
                        to : from,
                        from : '+19067537001',
                        body : "You have a mild " + survey.currentResponse});


                        sendSymptomSMS2();

                    // sendSymptomSMS(survey);

                }
                //moderate
                else if(messageBody == 3){
                    await client.messages.create({
                        to : from,
                        from : '+19067537001',
                        body : "You have a moderate " + survey.currentResponse});

                        sendSymptomSMS2();


                }
                //severe
                else if(messageBody == 4){
                    await client.messages.create({
                        to : from,
                        from : '+19067537001',
                        body : "You have a severe " + survey.currentResponse});


                    sendSymptomSMS2();

                }
                //Edge case
                else {
               await client.messages.create({
                   to: from,
                   from: '+1906753vey7001',
                   body: "Please enter a number from 0 to 4"
               });

           }
                break;
    }

    async function sendSymptomSMS(){
          let currentList = survey.symptom;
          if(currentList.length<=2)
          {
              await client.messages.create({
                  to: from,
                  from: '+19067537001',
                  body: "Thank you and see you soon"
              });
              // await client.messages.create({
              //     to : from,
              //     from : '+19067537001',
              //     body : currentString})
              // console.log("5");
              await surveyModel.findOneAndUpdate({ phoneNo: from },
                  {
                      $set: {
                          count: null
                      }
              });

          }
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
                      count : "2"

                  }
              });
          console.log("6");

    };


async function sendSymptomSMS2(){
  let currentList = survey.symptom;

  let currentMap = survey.responseMap;
  currentMap.set(survey.currentResponse, messageBody);

  // await surveyModel.findOneAndUpdate({phoneNo : from},
  // {
  //   $set: {
  //       count : "3",
  //       responseMap: currentMap
  //   }
  // });
    if (currentList.length <= 2) {
        await client.messages.create({
            to: from,
            from: '+19067537001',
            body: "Thank you and see you soon"
        });
        await surveyModel.findOneAndUpdate({ phoneNo: from },
            {
                $set: {
                    count: null,
                    responseMap: currentMap
                }
            });
    }
    let currentString = "Please indicate your symptom ";
    for (let i = 0; i < currentList.length; i++) {
        currentString += "(" + (i + 1) + ")" + currentList[i] + ", "
    }
    currentString += "(0) None";
    await client.messages.create({
        to: from,
        from: '+19067537001',
        body: currentString
    })
    await surveyModel.findOneAndUpdate({ phoneNo: from },
        {
            $set: {
                count: "2",
                responseMap: currentMap
            }
        });
};




});


//     }


module.exports = router;
