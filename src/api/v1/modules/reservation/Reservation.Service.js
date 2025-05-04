const { default: mongoose } = require('mongoose');
const ErrorHandler = require('../../../../enums/errors');
const { notificationMediumEnum } = require('../../../../enums/notification');
const { PaginateAggregateHelper } = require('../../../../helpers');
const Reservation = require('./Reservation.entity');
const Contract = require('../contract/entities/Contract.entity');
const Village = require('../location/entities/Village.entity');
const { ReservationStatusEnum } = require('../../../../enums/reservation');
class ReservationService {
  async create(data) {
    const contract = await Contract.findOne({ leadId: data.leadId });
    if (!contract) throw ErrorHandler.badRequest({}, 'This lead has no contract');

    if (!contract.remainingNights) throw ErrorHandler.badRequest({}, 'You have no remaining nights in your contract');
    if (Number(data.usage) > Number(contract.remainingNights))
      throw ErrorHandler.badRequest({}, 'You can not use more nights than available in the contract');
    if (Number(data.usage) > Number(contract.nightsCanUse))
      throw ErrorHandler.badRequest({}, 'You can not use more nights than available in the contract');

    const village = await Village.findOne({ _id: data.villageId }).populate('cityId');
    if (!village) throw ErrorHandler.notFound({}, 'Village not found');

    data.location = village.nameEn + ', ' + village.cityId.nameEn;

    contract.nightsCanUse = Number(contract.nightsCanUse) - Number(data.usage);
    contract.remainingNights = Number(contract.remainingNights) - Number(data.usage);
    contract.usageNights = Number(contract.usageNights) + Number(data.usage);
    await contract.save();

    data.contractId = contract._id;
    data.usageNumber = data.usage;
    data.usage = `-${data.usage}`;
    data.canEdit = true;

    const reservation = new Reservation(data);
    await reservation.save();
    return 'reservation created successfully';
  }

  async cancel(data) {
    const reservation = await Reservation.findOne({ _id: data._id }).populate('contractId');
    if (!reservation) throw ErrorHandler.notFound();
    if (!reservation.canEdit) throw ErrorHandler.badRequest({}, 'Reservation can not be edited');

    reservation.canEdit = false;
    await reservation.save();
    const newReservation = new Reservation({
      createdBy: data.createdBy,
      reservationDate: reservation.reservationDate,
      leadId: reservation.leadId,
      location: reservation.location,
      villageId: reservation.villageId,
      usage: `+${reservation.usageNumber}`,
      usageNumber: reservation.usageNumber,
      contractId: reservation.contractId,
      status: ReservationStatusEnum.Canceled,
      canEdit: false,
    });
    await newReservation.save();

    await Contract.findOneAndUpdate(
      { _id: reservation.contractId._id },
      {
        nightsCanUse: Number(reservation.contractId.nightsCanUse) + Number(reservation.usageNumber),
        remainingNights: Number(reservation.contractId.remainingNights) + Number(reservation.usageNumber),
        usageNights: Number(reservation.contractId.usageNights) - Number(reservation.usageNumber),
      },
    );
    return 'reservation canceled successfully';
  }
  async getAll(leadId, forMobile = false) {
    let query = { leadId };
    let data = await Reservation.find(query)
      .select('reservationDate location usage status createdBy canEdit')
      .populate('createdBy', 'name url')
      .sort('-createdAt');
    if (forMobile) {
      let totalBookedNights = 0;
      data.map((ele) => {
        if (ele.usage.startsWith('-')) {
          totalBookedNights += Number(ele.usage.slice(1));
        }
        if (ele.status === 'Canceled') {
          totalBookedNights -= Number(ele.usage.slice(1));
        }
      });
      data = {
        totalBookedNights,
        logs: data,
      };
    }
    return data;
  }
}
module.exports = new ReservationService();
