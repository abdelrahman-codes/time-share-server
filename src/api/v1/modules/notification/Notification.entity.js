const mongoose = require('mongoose');
const { notificationMediumEnum } = require('../../../../enums/notification');
const NotificationSchema = mongoose.Schema(
  {
    type: { type: String, required: true },
    message: { type: String, required: true },
    message_ar: { type: String },
    notificationMedium: {
      type: String,
      enum: [notificationMediumEnum.Both, notificationMediumEnum.Web, notificationMediumEnum.Mobile],
      default: notificationMediumEnum.Web,
    },
    forAllAdmins: { type: Boolean, default: false },
    forAllMobileUsers: { type: Boolean, default: false },
    refPage: { type: String, default: null },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    receivers: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
    isReadBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
  },
  {
    timestamps: true,
  },
);

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
module.exports = Notification;
