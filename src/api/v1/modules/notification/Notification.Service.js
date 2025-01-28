const { default: mongoose } = require('mongoose');
const ErrorHandler = require('../../../../enums/errors');
const { notificationMediumEnum } = require('../../../../enums/notification');
const { PaginateAggregateHelper } = require('../../../../helpers');
const Notification = require('./Notification.entity');
class NotificationService {
  async create(data) {
    const notification = new Notification(data);
    await notification.save();
    if (!notification)
      throw ErrorHandler.internalServerError(
        {},
        'An error occurred while creating new notification. Please try again later.',
      );
    return notification;
  }
  async getAll(userId, isAdmin, page, limit) {
    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
    };

    const matchQuery = {
      $or: [
        { receivers: new mongoose.Types.ObjectId(userId) },
        ...(isAdmin ? [{ forAllAdmins: true }] : [{ forAllMobileUsers: true }]),
      ],
      notificationMedium: {
        $in: isAdmin
          ? [notificationMediumEnum.Web, notificationMediumEnum.Both]
          : [notificationMediumEnum.Mobile, notificationMediumEnum.Both],
      },
    };

    const pipeline = [
      { $match: matchQuery },
      { $lookup: { from: 'users', localField: 'sender', foreignField: '_id', as: 'senderDetails' } },
      {
        $addFields: {
          isRead: { $in: [new mongoose.Types.ObjectId(userId), '$isReadBy'] },
          sender: {
            _id: { $arrayElemAt: ['$senderDetails._id', 0] },
            name: { $arrayElemAt: ['$senderDetails.name', 0] },
            url: { $arrayElemAt: ['$senderDetails.url', 0] },
          },
        },
      },
      {
        $project: {
          type: 1,
          message: 1,
          isRead: 1,
          notificationMedium: 1,
          refPage: 1,
          createdAt: 1,
          sender: 1,
        },
      },
    ];
    const paginatedResult = await PaginateAggregateHelper(Notification, pipeline, options);
    return paginatedResult;
  }
  async markAsRead(data) {
    const notification = await Notification.findByIdAndUpdate(data.notificationId, { $push: { isReadBy: data.userId } });
    if (!notification) throw ErrorHandler.notFound();
    return 'Notification marked as read successfully.';
  }
}
module.exports = new NotificationService();
