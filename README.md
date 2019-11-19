# TwilioSMS-App
a server application that allows the sending of SMS messages to the user and to create a conversation with the user. 

## Abstract
A server application that allows the sending of SMS messages to the user and to create a conversation with the user. The app is based on the Twilio API (https://www.twilio.com). The requirements are as follows:

The user is able to enroll in the app by texting START to your study text number.
The app provides the required validation to ensure the user is not re-enrolled if already enrolled in the app.
Upon enrolling in the app for the first time, the user is sent the message "Welcome to the study".

Step 1: After enrolling in the study the user should be sent the following message: "Please indicate your symptom (1)Headache, (2)Dizziness, (3)Nausea, (4)Fatigue, (5)Sadness, (0)None"
The user is only allowed to enter a number 0-5. If the user sends a message not in this range you should send the user a message : "Please enter a number from 0 to 5"
If the user enters 0, then send them this message "Thank you and we will check with you later." and stop the messaging for this user.

Step 2: After answering the symptom selection message the user should be asked to rank their symptom "On a scale from 0 (none) to 4 (severe), how would you rate your "xxxx" in the last 24 hours?", where "xxxx" is the symptom they selected in the first message.
The user is only allowed to enter a number 0-4. If the user sends a message not in this range you should send the user a message : "Please enter a number from 0 to 4"

Step 3: After answering the rating question the user should be sent a followup message based on the rating level they selected:
if 1 or 2 : then send "You have a mild xxxx" where xxxx is the symptom.
if 3 : then send "You have a moderate xxxx" where xxxx is the symptom.
if 4 : then send "You have a severe xxxx" where xxxx is the symptom.
if 0 : then send "You do not have a xxxx"
After the answering the rating question Step 1 should be repeated, the symptom question should be sent to the user 3 times. Make sure to drop the choices that were selected previously by the user. For example if the user picked Headache as a symptom, then the message should be : "Please indicate your symptom (1)Dizziness, (2)Nausea, (3)Fatigue, (4)Sadness, (0)None"
After the third time the following message should be sent to the user : "Thank you and see you soon"
