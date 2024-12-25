# MCC-Full-Stack-Developer
In this repository I have created a scheduling system application which allows admins to send email notifications to the employees
based on the time interval i.e. 1-hour before 30-minuted before and 15-minutes before the meeting after the last email is sent a mail is
also sent to the admin confirming all the mails was sent successfully!!
the technology that I used to implement this working is

- *Mysql:-* For storing the data and schedules in the database .
- *Node.js:-* For the api building and the backend tasks.
- *Express.js:-*  For the initializing the server for the backend.
- *S.M.T.P:-* For sending mails to the employees.
- *React.js:-* For the front-end of the application.
****

## How I achieved this functionality:-
I achieved this functionality in a few steps.

**Step 1:- Storing the schedules in a table** I store all the schedules in a separate table I called it as schedules table here all the schedules scheduled by the admin so far are being stored with there time and date format along with other data, and they are also mapped with the admin Id as to who scheduled it (which helped me sending the last mail to the admin as well) and here corresponding to each row I have a notification column which basically is an object containing the boolean value 15, 30 and 1 hour time and after fetching these schedules I compare the current time with the scheduled time and comparing the time difference I then send the email to the respective people for that respective time interval.

**Step 2:- Check for the Upcoming schedules** After fetching all the upcoming schedules from the db I then ran a **node-cron** every minute which computes the time difference of each schedule individually and check for the notification column if the following mail for that particular time difference is sent or not if the value is true it moves forward if not then send's the mail to the employee by using the **SMTP** mail service.