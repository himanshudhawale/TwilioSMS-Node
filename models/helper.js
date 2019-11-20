var mongoose = require('mongoose');
const db = require('_helpers/db');
const Twilio = db.Twilio;


var Task = {
    message:function(body,callback) {
    console.log(body["message"]);
    const twilio = await Twilio.find();
    return (twilio, callback);
},

saveResponse1:function(no,response,callback) {
    const twilio = await Twilio.findOne({phoneNo : no});
    var tt = twilio;
    tt.response1 = response;
    tt.count = 1;
    Object.assign(twilio,tt);
    await twilio.save();
    return (twilio, callback);
},

checkEnrollment(no,callback){
     const twilio = await Twilio.findOne({phoneNo : no});
     return (twilio.count, callback);
},

getSymptopms: function(row,callback) {
  var symptom =['Headache','Dizziness','Nausea','Fatigue','Sadness'];
    return (symptom,callback)
},

getCount:function(phone,callback){
     const twilio = await Twilio.findOne({phoneNo : no});
     return (twilio,callback);
},

getCurrentSymptoms: function(phone,callback) {
    const twilio = await Twilio.findOne({phoneNo : no});
    return (twilio.symptom,callback);
},

getResponse1: function(phone,callback) {
    const twilio = await Twilio.findOne({phoneNo : no});
    return (twilio.response1, callback);
},
getSymptopmByID: function(id,callback) {
    const twilio = await Twilio.findOne({phoneNo : no});
    return (twilio.symptom, callback);
},
enroll:function(no,callback) {
  const twilio = await Twilio.insertOne({phoneNo : no});
  return (twilio,callback);
},
getResponse2: function(phone,callback) {
    const twilio = await Twilio.findOne({phoneNo : no});
    return (twilio.response2, callback);
},getResponse3: function(phone,callback) {
    const twilio = await Twilio.findOne({phoneNo : no});
    return (twilio.response3, callback);
}

};
module.exports=Task;
