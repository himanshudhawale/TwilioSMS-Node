const router = require('express').Router();
const accountSID = process.env.ACCOUNT_SID;
const authToken = process.env.AUHT_TOKEN;
const surveyModel = require('../models/surveySchema');
const client = require('twilio')(accountSID,authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

let currentList=[]
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
    else if(survey && messageBody=="START"){
        let currentList = ['Headache', 'Dizziness', 'Nausea', 'Fatigue', 'Sadness'];
        await surveyModel.findOneAndUpdate({phoneNo : from},
            {
                $set:{
                    count : "1",
                    symptom : currentList
            }
        });
        console.log("4");
        // sendSyxmptomSMS();

    }


    else if(survey && messageBody=="START"){
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

    if (survey) {
          switch (survey.count) {

              case "2":
                  sendScaleSMS()
                  break;

              case "3":
                  sendReportSMS()
                  break;

              // case "null":
              //      sendSymptomSMS()
              //      break;
          }
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
              await surveyModel.findOneAndUpdate({ phoneNo : from},
                {
                  $set : {
                    count : "null"
                  }

              });
              let xsxs = ['Headache', 'Dizziness', 'Nausea', 'Fatigue', 'Sadness'];

              await surveyModel.findOneAndUpdate({ phoneNo: from },
                  {
                      $set: {
                          count: null,
                          symptom: xsxs
                          
                      }
              });
              res.end();
            return;

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

    async function sendScaleSMS(){
      currentList = survey.symptom;
        if (messageBody == 0) {
            await client.messages.create({
                to: from,
                from: '+19067537001',
                body: "Thank you and we will check with you later."
            });
            let xsxs = ['Headache', 'Dizziness', 'Nausea', 'Fatigue', 'Sadness'];
            await surveyModel.findOneAndUpdate({ phoneNo: from },
                {
                    $set: {
                        count: null,
                        symptom: xsxs
                    }
                });

        }
        else if (messageBody > 0 && messageBody <= currentList.length) {
            let symp = currentList[messageBody - 1];
            await client.messages.create({
                to: from,
                from: '+19067537001',
                body: "On a scale from 0 (none) to 4 (severe), how would you rate your " + symp + " in the last 24 hours?"
            });
            var ss = currentList.filter(e => e !== symp);
            await surveyModel.findOneAndUpdate({ phoneNo: from },
                {
                    $set: {
                        count: "3",
                        currentResponse: symp,
                        symptom: ss
                    }
                });
        }
        else if (messageBody != "START"){
            await client.messages.create({
                to: from,
                from: '+19067537001',
                body: "Please enter a number from 0 to " + currentList.length
            });
        }
    };

    async function sendReportSMS(){
        if (messageBody == 0) {
            await client.messages.create({
                to: from,
                from: '+19067537001',
                body: "You do not have a " + survey.currentResponse
            });
            sendSymptomSMS();

        }
        else if (messageBody >= 1 && messageBody <= 2) {
            await client.messages.create({
                to: from,
                from: '+19067537001',
                body: "You have a mild " + survey.currentResponse
            });
            sendSymptomSMS();
        }
        else if (messageBody == 3) {
            await client.messages.create({
                to: from,
                from: '+19067537001',
                body: "You have a moderate " + survey.currentResponse
            });
            sendSymptomSMS();
        }
        else if (messageBody == 4) {
            await client.messages.create({
                to: from,
                from: '+19067537001',
                body: "You have a severe " + survey.currentResponse
            });
            sendSymptomSMS();
        }
        else if(messageBody != "START") {
            await client.messages.create({
                to: from,
                from: '+19067537001',
                body: "Please enter a number from 0 to 4"
            });

        }
        // else if(messageBody == "START"){
        //   let currentList = ['Headache', 'Dizziness', 'Nausea', 'Fatigue', 'Sadness'];
        //   await surveyModel.findOneAndUpdate({phoneNo : from},
        //       {
        //           $set:{
        //               count : "1",
        //               symptom : currentList
        //       }
        //   });
        // }


    };

// async function sendSymptomSMS2(){
//   let currentList = survey.symptom;
//
//   let currentMap = survey.responseMap;
//   currentMap.set(survey.currentResponse, messageBody);
//
//   // await surveyModel.findOneAndUpdate({phoneNo : from},
//   // {
//   //   $set: {
//   //       count : "3",
//   //       responseMap: currentMap
//   //   }
//   // });
//     if (currentList.length <= 2) {
//         await client.messages.create({
//             to: from,
//             from: '+19067537001',
//             body: "Thank you and see you soon"
//         });
//         await surveyModel.findOneAndUpdate({ phoneNo: from },
//             {
//                 $set: {
//                     count: null,
//                     responseMap: currentMap
//                 }
//             });
//     }
//     let currentString = "Please indicate your symptom ";
//     for (let i = 0; i < currentList.length; i++) {
//         currentString += "(" + (i + 1) + ")" + currentList[i] + ", "
//     }
//     currentString += "(0) None";
//     await client.messages.create({
//         to: from,
//         from: '+19067537001',
//         body: currentString
//     })
//     await surveyModel.findOneAndUpdate({ phoneNo: from },
//         {
//             $set: {
//                 count: "2",
//                 responseMap: currentMap
//             }
//         });
// };


  res.end();


});


//     }


module.exports = router;
