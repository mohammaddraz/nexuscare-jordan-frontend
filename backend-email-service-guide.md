# SehaGrid Jordan - Backend Email Service Integration Guide

*This document outlines the planned architecture for Phase 2 (Backend) of the SehaGrid Jordan project, specifically addressing the assignment requirement for API integrations.*

## Overview
While the frontend relies on Google Maps, the backend API (Node.js/Express) will utilize **Nodemailer** to send transactional emails to users. 

This replaces the "OpenWeather" API suggestion with something highly relevant to a healthcare portal.

## Use Cases for Email Integration
1. **Consumer Portal**: Sending a welcome email when a family creates a new account.
2. **Provider Portal**: Sending status updates when a Consumer's PCP assignment request is Approved or Rejected by the clinic.
3. **Admin Portal**: Alerting doctors when their licensure certification has been successfully verified by the MOH.

## Tech Stack Requirements
- **Node.js** & **Express**
- **Nodemailer** (`npm install nodemailer`)
- **SMTP Server**: For development, we recommend using [Mailtrap](https://mailtrap.io/) or a Gmail App Password.

## Implementation Blueprint

### 1. Environment Variables (`.env`)
The backend will need the following environment variables:
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass
EMAIL_FROM="SehaGrid Jordan <noreply@sehagrid.jo>"
```

### 2. Email Service Module (`src/services/emailService.js`)
Create a reusable service for sending emails:

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: htmlContent,
    });
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email: ', error);
    return false;
  }
};

module.exports = { sendEmail };
```

### 3. Usage in Controller (Example: Provider Approving PCP Request)

```javascript
const { sendEmail } = require('../services/emailService');

exports.approvePcpRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // 1. Update database status to 'Approved'
    // const request = await db.Request.update({ status: 'Approved' }, { where: { id: requestId }});
    // const patientEmail = request.patientEmail;
    
    // Mocking the email for this example
    const patientEmail = "ahmed.alamiri@example.com";
    
    // 2. Send Email Notification via Nodemailer
    const emailSubject = "SehaGrid: Primary Care Provider Approved";
    const emailBody = `
      <h2>PCP Assignment Approved</h2>
      <p>Dear Patient,</p>
      <p>Your request to assign Dr. Reem Al-Khalidi as your Primary Care Provider has been approved by the clinic.</p>
      <p>You may now book appointments and log visits through the SehaGrid portal.</p>
      <br/>
      <p>Regards,<br/>The SehaGrid Jordan Team</p>
    `;
    
    await sendEmail(patientEmail, emailSubject, emailBody);

    return res.status(200).json({ message: "Request approved and patient notified." });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
```

## Grading Criteria Alignment (D1, D2, D3)
This planned integration fulfills the assignment criteria by proving an understanding of full-stack RESTful communication where the React frontend triggers an Express backend controller, which subsequently utilizes an external NPM module (Nodemailer) and SMTP network protocols to deliver real-world utility.
