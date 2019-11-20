var express = require('express');
var router = express.Router();
var Task=require('../models/helper');
var MessagingResponse = require('twilio').twiml.MessagingResponse;


 router.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();
    var phone = req.body.From;
    console.log(phone);
    var input = req.body.Body;
    console.log(input);
    var row; var rows="";
    var symptomString="Please indicate your symptom ";
    var rankString1="On a scale from 0 (none) to 4 (severe), how would you rate your ";
    var rankString2=" in the last 24 hours?";
    if( input.toLowerCase() == "start"){
      Task.checkEnrollment(phone,function (e,co) {
        console.log(co[0].a_count);
        if(co[0].a_count==0){
          console.log("new enrollment");
          Task.enroll(phone,function(erro,resp) {
            if(erro){
              console.log(erro);
              return;
            }


          Task.getSymptopms(row,function (err,response) {
              if(err)
              rows= err;
              else{
              rows=response;
              var temp = symptomString;
              rows.forEach(function(element,i) {
                //  console.log(element.name);
                   temp= temp+ "("+(i)+") "+element.name+" ";
                });
              twiml.message(temp);
              res.writeHead(200, {'Content-Type': 'text/xml'});
              res.end(twiml.toString());
              }
          })
      }
      );
        }
        else{
        console.log("user exist");
        Task.getCount(phone,function(req1,k) {
          var res1 = k[0].count;
          if(res1 ==6){
            twiml.message("You have already completed the survey. send 'restart' to retake");
            res.writeHead(200, {'Content-Type': 'text/xml'});
                    res.end(twiml.toString());
                    return;
          }
         if(res1%2==0){
          Task.getCurrentSymptoms(phone,function (err,response) {
            console.log(response);
              if(err)
              rows= err;
              else{
              rows=response[0];
              var temp = symptomString;
              rows.forEach(function(element,i) {
                  //console.log(element.name);
                  temp= temp+ "("+(i)+") "+element.name+" ";
                });
              twiml.message(temp);
              res.writeHead(200, {'Content-Type': 'text/xml'});
              res.end(twiml.toString());
              }
          })}else{
            if(res1==1){
              Task.getResponse1(phone,function(a,b) {
                console.log(b[0]);
                Task.getSymptopmByID(b[0].response1,function(c,d){
                  var temp = rankString1 + d[0].name + rankString2 ;
                  twiml.message(temp);
                  res.writeHead(200, {'Content-Type': 'text/xml'});
                  res.end(twiml.toString());
                });
              })
            }
            if(res1==3){
              Task.getResponse2(phone,function(a,b) {
                Task.getSymptopmByID(b[0].response2,function(c,d){
                  var temp = rankString1 + d[0].name + rankString2 ;
                  twiml.message(temp);
                  res.writeHead(200, {'Content-Type': 'text/xml'});
                  res.end(twiml.toString());
                });
              })
            }
            if(res1==5){
              Task.getResponse3(phone,function(a,b) {
                Task.getSymptopmByID(b[0].response3,function(c,d){
                  var temp = rankString1 + d[0].name + rankString2 ;
                  twiml.message(temp);
                  res.writeHead(200, {'Content-Type': 'text/xml'});
                  res.end(twiml.toString());
                });
              })
            }
          }

    });
  }
      });



}
// else if(Number(input)>0 && Number(input)<6){
//
//   Task.getCount(phone,function(req1,k) {
//
// var res1 = k[0].count;
//     if (res1==0) {
//       Task.saveResponse1(phone,input,function(a,b) {
//          Task.getSymptopmByID(input,function(c,d){
//           var temp = rankString1 + d[0].name + rankString2 ;
//            twiml.message(temp);
//            res.writeHead(200, {'Content-Type': 'text/xml'});
//            res.end(twiml.toString());
//          });
//       });
//     }else if (res1==1){
//       Task.saveRank1(phone,input,function(a,b) {
//         Task.getCurrentSymptoms(phone,function(c,d) {
//           var temp = symptomString;
//             d[0].forEach(function(element,i) {
//                // console.log(element.name,i);
//                 temp= temp+ "("+(i)+") "+element.name+" ";
//               });
//             twiml.message(temp);
//             res.writeHead(200, {'Content-Type': 'text/xml'});
//             res.end(twiml.toString());
//         })
//       });
//     }else if (res1==2){
//       Task.getResponse1(phone,function(u,v) {
//         if (v[0].response1 <=input) {
//           console.log("incrementing index");
//           input= Number(input)+1;
//           input= input.toString();
//         }
//
//       Task.saveResponse2(phone,input,function(a,b) {
//         Task.getSymptopmByID(input,function(c,d){
//           var temp = rankString1 + d[0].name + rankString2 ;
//           twiml.message(temp);
//           res.writeHead(200, {'Content-Type': 'text/xml'});
//           res.end(twiml.toString());
//         });
//       });
//     })
//     }else if (res1==3){
//       Task.saveRank2(phone,input,function(a,b) {
//         Task.getCurrentSymptoms(phone,function(c,d) {
//           var temp = symptomString;
//           d[0].forEach(function(element,i) {
//                 //console.log(element.name);
//                 temp= temp+ "("+(i)+") "+element.name+" ";
//               });
//             twiml.message(temp);
//             res.writeHead(200, {'Content-Type': 'text/xml'});
//             res.end(twiml.toString());
//         })
//       });
//     }
//     else if (res1==4){
//      Task.getResponse1(phone,function(u1,v1) {
//         if (v1[0].response1 <=input) {
//           input= Number(input)+1;
//           input= input.toString();
//           console.log("< res2");
//         }
//
//         Task.getResponse2(phone,function(u,v) {
//
//           if (v[0].response2 <=input) {
//             input= Number(input)+1;
//             input= input.toString();
//             console.log("< res1");
//           }
//       Task.saveResponse3(phone,input,function(a,b) {
//         Task.getSymptopmByID(input,function(c,d){
//           var temp = rankString1 + d[0].name + rankString2 ;
//           twiml.message(temp);
//           res.writeHead(200, {'Content-Type': 'text/xml'});
//           res.end(twiml.toString());
//         });
//       });
//     });
//     });
//     }else if (res1==5){
//       Task.saveRank3(phone,input,function(a,b) {
//         twiml.message("Thank you for completing the survey.");
//         res.writeHead(200, {'Content-Type': 'text/xml'});
//                 res.end(twiml.toString());
//       });
//     } else if (res1==6){
//       twiml.message("Thank you for completing the survey. you can retake the survey by sending 'restart' ");
//       res.writeHead(200, {'Content-Type': 'text/xml'});
//               res.end(twiml.toString());
//     }
//
//   })
//
// }
// else
// if(Number(input) == 0){
//     twiml.message("Thank you and we will check with you later.");
//     res.writeHead(200, {'Content-Type': 'text/xml'});
//             res.end(twiml.toString());
// } else
// if(input.toLowerCase()== "restart"){
//   Task.deleteEnrollment(phone,function (params) {
//     twiml.message("Successfully removed the enrollment you can retake the survey by sending 'start'.");
//     res.writeHead(200, {'Content-Type': 'text/xml'});
//             res.end(twiml.toString());
//   })
// }else{
//   twiml.message("Incorrect input");
//     res.writeHead(200, {'Content-Type': 'text/xml'});
//             res.end(twiml.toString());
// }
//
//
//
 }
  );

 module.exports=router;
