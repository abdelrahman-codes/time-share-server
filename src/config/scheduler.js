const cron = require('node-cron');
const { sendToMultipleUsers } = require('./push-notification');
const ContractInstallment = require('../api/v1/modules/contract/entities/ContractInstallment.entity');
const Notification = require('../api/v1/modules/notification/Notification.entity');
const { notificationTypeEnum, notificationMediumEnum } = require('../enums/notification');
function Scheduler() {
  try {
    // 0 0 * * *
    cron.schedule('0 * * * *', async () => {
      const notifications = [],
        pushNotifications = [];
      const today = new Date();
      // today.setHours(0, 0, 0, 0);

      const oneDayLater = new Date();
      oneDayLater.setDate(today.getDate() + 1);
      // oneDayLater.setHours(0, 0, 0, 0);

      const fiveDaysLater = new Date();
      fiveDaysLater.setDate(today.getDate() + 5);
      // fiveDaysLater.setHours(0, 0, 0, 0);

      const installmentsTodayIds = [],
        installmentsOneDayLaterIds = [],
        installmentsFiveDaysLaterIds = [];
      const [installmentsToday, installmentsOneDayLater, installmentsFiveDaysLater] = await Promise.all([
        ContractInstallment.find({
          nextInstallment: true,
          isNotifiedFiveDays: true,
          isNotifiedOneDay: true,
          isNotifiedSameDay: false,
          installmentDate: { $lte: today }, // Exact match
        }).populate('leadId', 'fcmToken'),

        ContractInstallment.find({
          nextInstallment: true,
          isNotifiedFiveDays: true,
          isNotifiedOneDay: false,
          installmentDate: { $lte: oneDayLater }, // Exact match
        }).populate('leadId', 'fcmToken'),

        ContractInstallment.find({
          nextInstallment: true,
          isNotifiedFiveDays: false,
          installmentDate: { $lte: fiveDaysLater }, // Exact match
        }).populate('leadId', 'fcmToken'),
      ]);
      installmentsToday.map((ele) => {
        notifications.push({
          type: notificationTypeEnum.InstallmentReminder,
          message: `Reminder: Your installment is due today! 🚀 Pay online via the app or contact customer service.`,
          message_ar: 'تذكير: قسطك مستحق اليوم! 🚀 ادفع عبر التطبيق أو تواصل مع خدمة العملاء.',
          receivers: ele.leadId._id,
          notificationMedium: notificationMediumEnum.Mobile,
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
      installmentsOneDayLater.map((ele) => {
        notifications.push({
          type: notificationTypeEnum.InstallmentReminder,
          message: `Reminder: Your installment is due in 1 day! ⏳ Pay online via the app or contact customer service.`,
          message_ar: 'تذكير: قسطك مستحق خلال يوم واحد! ⏳ ادفع عبر التطبيق أو تواصل مع خدمة العملاء.',
          receivers: ele.leadId._id,
          notificationMedium: notificationMediumEnum.Mobile,
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
      installmentsFiveDaysLater.map((ele) => {
        notifications.push({
          type: notificationTypeEnum.InstallmentReminder,
          message: `Heads up! Your installment is due in 5 days. 🎯 Pay online via the app or contact support.`,
          message_ar: 'انتبه! قسطك مستحق خلال 5 أيام. 🎯 ادفع عبر التطبيق أو تواصل مع الدعم.',
          receivers: ele.leadId._id,
          notificationMedium: notificationMediumEnum.Mobile,
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
