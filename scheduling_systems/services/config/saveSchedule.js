import { db } from './db.js';

export const saveScheduleToDatabase = async ({ employees, date, time, comment, adminEmail }) => {

    try {
        const [scheduleResult] = await db.promise().query(
            `INSERT INTO schedules (date, time, comment, admin_email, notification_sent) VALUES (?, ?, ?, ?, ?)`,
            [date, time, comment, adminEmail, '{}']
        );

        const scheduleId = scheduleResult.insertId;

        const employeeInserts = employees.map((employee) =>
            db.promise().query(
                `INSERT INTO schedule_employees (schedule_id, employee_id, employee_name, employee_email) VALUES (?, ?, ?, ?)`,
                [scheduleId, employee.id, employee.name, employee.email]
            )
        );

        await Promise.all(employeeInserts);

        console.log('Schedule saved successfully!');
    } catch (err) {
        console.error('Error saving schedule:', err);
    }
};
