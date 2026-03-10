# BloodConnect – Serverless Blood Donation Alert System

BloodConnect is a serverless web application built on AWS that connects blood donors with people who need blood during emergencies.

The system allows users to register as blood donors and receive instant email alerts whenever a blood request is submitted.

This project demonstrates how serverless cloud services can be used to build scalable and event-driven applications.

---

## Project Architecture

User interacts with a static website hosted on Amazon S3.  
The frontend communicates with API Gateway which triggers AWS Lambda functions.  
Lambda functions store donor data in DynamoDB and publish notifications to Amazon SNS which sends email alerts to subscribed donors.

Flow:

User → S3 Static Website → API Gateway → Lambda → DynamoDB → SNS → Email Alerts

---

## AWS Services Used

• Amazon S3 – Static website hosting  
• Amazon API Gateway – REST API endpoints  
• AWS Lambda – Backend compute logic  
• Amazon DynamoDB – NoSQL database for donor information  
• Amazon SNS – Email notification service

---

## Features

• Donor registration form  
• Blood request form  
• Automatic email subscription confirmation for donors  
• Instant email alerts when blood is requested  
• Serverless architecture (no servers to manage)  
• Scalable and event-driven design

---

## System Workflow

### Donor Registration

1. User fills the donor registration form.
2. Request is sent to API Gateway.
3. API Gateway triggers the RegisterDonor Lambda function.
4. Lambda stores donor details in DynamoDB.
5. Lambda publishes an SNS message for email subscription.
6. User receives a subscription confirmation email and accepts it.

### Blood Request

1. User submits a blood request form.
2. API Gateway triggers the BloodRequest Lambda function.
3. Lambda publishes a message to SNS.
4. SNS sends alert emails to all subscribed donors.

---

## API Endpoints

POST /register  
Registers a new blood donor.

POST /request  
Submits a blood request and sends alerts to donors.

---

## Example Donor Registration Request
{
"name": "Rahul",
"blood_group": "O+",
"phone": "9999999999",
"city": "Bangalore",
"address": "MG Road",
"health_issue": "None"
}


---

## Example Blood Request
{
"blood_group": "O+",
"hospital": "Apollo Hospital",
"address": "MG Road",
"city": "Bangalore",
"contact": "9999999999"
}


---


## Future Improvements

• Filter notifications based on blood group  
• Add SMS alerts for donors  
• Add authentication for admin access  
• Build a dashboard to view donors and requests  
• Deploy with CloudFront for better performance

---
