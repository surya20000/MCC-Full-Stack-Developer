import express from "express";
import { sendEmail } from "../config/email.config.js";
import { saveScheduleToDatabase } from "../config/saveSchedule.js";
import cron from "node-cron";
import { db } from "../config/db.js";

const router = express.Router();

router.post("/meetings", async (req, res) => {
  try {
    const { employees, date, time, comment, adminEmail } = req.body;

    if (!employees || !date || !time || !comment || !adminEmail) {
      return res.status(400).json({ error: "All fields are required." });
    }

    await saveScheduleToDatabase({
      employees,
      date,
      time,
      comment,
      adminEmail,
    });

    res.status(201).json({ message: "Schedule created successfully!" });
  } catch (err) {
    console.error("Error processing schedule:", err);
    res.status(500).json({ error: "Failed to create schedule." });
  }
});

function timeToMilliseconds(timeStr) {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  return hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
}

//* cron scheduled to run every minute to check if there is any schedule present

cron.schedule("* * * * *", async () => {
  const now = new Date();

  try {
    const [rows] = await db.promise().query(
      `SELECT s.id, s.date, s.time, s.comment, s.admin_email, s.notification_sent, 
              e.employee_name, e.employee_email
       FROM schedules s
       JOIN schedule_employees e ON s.id = e.schedule_id
       WHERE TIMESTAMP(s.date, s.time) > ?
         AND TIMESTAMP(s.date, s.time) <= ?`,
      [now, new Date(now.getTime() + 60 * 60 * 1000)]
    );

    console.log(rows);

    for (const row of rows) {
    
      const indiaTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(new Date()); 
      
      const scheduleTimeMillis = timeToMilliseconds(row.time);
      const currentTimeMillis = timeToMilliseconds(indiaTime);

      const timeDiff = scheduleTimeMillis - currentTimeMillis;
      const notificationSent =
        typeof row.notification_sent === "string"
          ? JSON.parse(row.notification_sent)
          : row.notification_sent || {};

      let reminderType = null;

      if (timeDiff === 15 * 60 * 1000 && !notificationSent["15_minutes"]) {
        reminderType = "15 minutes";
        notificationSent["15_minutes"] = true;
      } else if (
        timeDiff === 30 * 60 * 1000 &&
        !notificationSent["30_minutes"]
      ) {
        reminderType = "30 minutes";
        notificationSent["30_minutes"] = true;
      } else if (timeDiff === 60 * 60 * 1000 && !notificationSent["1_hour"]) {
        reminderType = "1 hour";
        notificationSent["1_hour"] = true;
      }

      if (reminderType) {
        // Send email to employee
        await sendEmail({
          to: row.employee_email,
          messageBody: `Reminder (${reminderType}): ${row.comment}`,
          employeeName: row.employee_name,
          date: row.date,
          Time: row.time,
        });

        console.log(`Email sent to ${row.employee_email} for ${reminderType}`);

        // Notify admin after the last email (15 minutes reminder)
        if (reminderType === "15 minutes") {
          await sendEmail({
            to: row.admin_email,
            messageBody:
              "All emails sent for this schedule. Upcoming meeting soon.",
            employeeName: "Admin",
            date: row.date,
            Time: row.time,
          });

          console.log(`Admin notified for schedule ID ${row.id}`);
        }

        await db
          .promise()
          .query(`UPDATE schedules SET notification_sent = ? WHERE id = ?`, [
            JSON.stringify(notificationSent),
            row.id,
          ]);

        console.log("Update query executed successfully.");
      }
    }

    console.log("Cron job executed successfully!");
  } catch (err) {
    console.error("Error executing cron job:", err);
  }
});

export default router;
