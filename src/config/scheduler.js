const cron = require('node-cron');
const { sendToMultipleUsers } = require('./push-notification');
const ContractInstallment = require('../api/v1/modules/contract/entities/ContractInstallment.entity');
const Notification = require('../api/v1/modules/notification/Notification.entity');
const { notificationTypeEnum } = require('../enums/notification');
function Scheduler() {
  try {
    // 0 0 * * *
    cron.schedule('0 0 * * *', async () => {
      const notifications = [],
        pushNotifications = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const oneDayLater = new Date();
      oneDayLater.setDate(today.getDate() + 1);
      oneDayLater.setHours(0, 0, 0, 0);

      const fiveDaysLater = new Date();
      fiveDaysLater.setDate(today.getDate() + 5);
      fiveDaysLater.setHours(0, 0, 0, 0);

      const installmentsTodayIds = [],
        installmentsOneDayLaterIds = [],
        installmentsFiveDaysLaterIds = [];
      const [installmentsToday, installmentsOneDayLater, installmentsFiveDaysLater] = await Promise.all([
        ContractInstallment.find({
          nextInstallment: true,
          isNotifiedFiveDays: true,
          isNotifiedOneDay: true,
          isNotifiedSameDay: false,
          installmentDate: { $eq: today }, // Exact match
        }).populate('leadId', 'fcmToken'),

        ContractInstallment.find({
          nextInstallment: true,
          isNotifiedFiveDays: true,
          isNotifiedOneDay: false,
          installmentDate: { $eq: oneDayLater }, // Exact match
        }).populate('leadId', 'fcmToken'),

        ContractInstallment.find({
          nextInstallment: true,
          isNotifiedFiveDays: false,
          installmentDate: { $eq: fiveDaysLater }, // Exact match
        }).populate('leadId', 'fcmToken'),
      ]);

      installmentsToday.forEach((ele) => {
        notifications.push({
          type: notificationTypeEnum.InstallmentReminder,
          message: `Reminder: Your installment is due today! 🚀 Pay online via the app or contact customer service.`,
          receivers: ele.leadId._id,
        });
        installmentsTodayIds.push(ele._id);
        if (ele?.leadId.fcmToken) {
          pushNotifications.push({
            token: ele.leadId.fcmToken,
            title: 'Reminder',
            body: `Your installment is due today! 🚀 Pay online via the app or contact customer service.`,
          });
        }
      });

      // Process Installments Due in 1 Day
      installmentsOneDayLater.forEach((ele) => {
        notifications.push({
          type: notificationTypeEnum.InstallmentReminder,
          message: `Reminder: Your installment is due in 1 day! ⏳ Pay online via the app or contact customer service.`,
          receivers: ele.leadId._id,
        });
        installmentsOneDayLaterIds.push(ele._id);
        if (ele?.leadId.fcmToken) {
          pushNotifications.push({
            token: ele.leadId.fcmToken,
            title: 'Reminder',
            body: `Your installment is due in 1 day! ⏳ Pay online via the app or contact customer service.`,
          });
        }
      });

      // Process Installments Due in 5 Days
      installmentsFiveDaysLater.forEach((ele) => {
        notifications.push({
          type: notificationTypeEnum.InstallmentReminder,
          message: `Heads up! Your installment is due in 5 days. 🎯 Pay online via the app or contact support.`,
          receivers: ele.leadId._id,
        });
        installmentsFiveDaysLaterIds.push(ele._id);
        if (ele?.leadId.fcmToken) {
          pushNotifications.push({
            token: ele.leadId.fcmToken,
            title: 'Reminder',
            body: `Heads up! Your installment is due in 5 days. 🎯 Pay online via the app or contact support.`,
          });
        }
      });

      if (notifications.length) {
        await Notification.insertMany(notifications);
      }

      if (pushNotifications.length) {
        await sendToMultipleUsers(pushNotifications);
      }
      if (installmentsTodayIds.length || installmentsOneDayLaterIds.length || installmentsFiveDaysLaterIds.length) {
        await Promise.all([
          installmentsFiveDaysLaterIds.length
            ? ContractInstallment.updateMany({ _id: { $in: installmentsFiveDaysLaterIds } }, { isNotifiedFiveDays: true })
            : Promise.resolve(),

          installmentsOneDayLaterIds.length
            ? ContractInstallment.updateMany({ _id: { $in: installmentsOneDayLaterIds } }, { isNotifiedOneDay: true })
            : Promise.resolve(),

          installmentsTodayIds.length
            ? ContractInstallment.updateMany({ _id: { $in: installmentsTodayIds } }, { isNotifiedSameDay: true })
            : Promise.resolve(),
        ]);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { Scheduler };
