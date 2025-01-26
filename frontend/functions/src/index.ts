import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { User, Task } from "./utils";
D
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const createEmailContent = (
  user: User,
  task: Task,
  daysUntilDeadline: number
): string => {
  const priorityColors = {
    Low: "#4CAF50",
    Medium: "#FFC107",
    High: "#F44336",
  };

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; text-transform: capitalize;">Hello ${user.name},</h2>
      <p>This is a reminder about your upcoming task:</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-transform: capitalize;">
        <h3 style="color: ${
          priorityColors[task.priority]
        }; margin-top: 0; text-transform: capitalize;">
          ${task.name}
        </h3>
        <p><strong>Due Date:</strong> ${new Date(
          task.deadline
        ).toLocaleDateString()}</p>
        <p><strong>Category:</strong><span style="text-transform: capitalize;">${
          task.category
        }</span></p>
        <p><strong>Priority:</strong> <span style="color: ${
          priorityColors[task.priority]
        }; text-transform: capitalize;">${task.priority}</span></p>
        ${
          task.description
            ? `<p><strong>Description:</strong> ${task.description}</p>`
            : ""
        }
      </div>
      
      <p>You have ${daysUntilDeadline} days remaining to complete this task.</p>
      
      <div style="margin-top: 30px; font-size: 12px; color: #666;">
        <p>To change your reminder days, please visit your profile.</p>
      </div>
    </div>
  `;
};

admin.initializeApp();

export const checkDeadlinesAndSendEmails = onSchedule(
  {
    schedule: "0 0 * * *",
    timeZone: "UTC",
  },
  async (event) => {
    try {
      const db = admin.firestore();
      const now = new Date();
      const usersSnapshot = await db.collection("users").get();

      for (const userDoc of usersSnapshot.docs) {
        const user = userDoc.data() as User;
        const reminderDays = user.reminderDays || 3;

        for (const task of user.tasks) {
          const deadline = new Date(task.deadline);
          const daysUntilDeadline = Math.ceil(
            (deadline.getTime() - now.getTime()) / (1000 * 3600 * 24)
          );

          if (daysUntilDeadline === reminderDays) {
            const transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              secure: true,
              auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
              },
            });

            await transporter.sendMail({
              from: `"AssignMe" <${process.env.EMAIL}>`,
              to: user.email,
              subject: `Reminder: "${task.name}" due in ${reminderDays} days`,
              html: createEmailContent(user, task, daysUntilDeadline),
            });
          }
        }
      }
    } catch (error) {
      console.error("Error processing reminders:", error);
    }
  }
);
