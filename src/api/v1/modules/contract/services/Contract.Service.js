const ErrorHandler = require('../../../../../enums/errors');
const Contract = require('../entities/Contract.entity');
const ContractInstallment = require('../entities/ContractInstallment.entity');
const { VillageService } = require('../../location/services');
const {
  ContractPaymentMethodEnum,
  ContractPaidStatusEnum,
  PackageTypeEnum,
  installmentsTypeEnum,
} = require('../../../../../enums/contract');
const User = require('../../user/User.entity');
const Village = require('../../location/entities/Village.entity');
const Roles = require('../../../../../enums/roles');
const { ContactMethodEnum, GetFromEnum, UserCategoryEnum, TicketStatusEnum } = require('../../../../../enums/lead');
class ContractService {
  async create(data) {
    const LeadService = require('../../lead/Lead.Service');
    await LeadService.getDetails(data.leadId);

    const exists = await Contract.findOne({ leadId: data.leadId });
    if (exists) throw ErrorHandler.badRequest({}, 'Already have a contract');

    const village = await VillageService.getDetails(data.villageId);
    data.cityId = village.cityId;

    const contract = new Contract(data);
    await contract.save();
    if (data.paymentMethod === ContractPaymentMethodEnum.Installments) {
      data.contractInstallmentsList = data.contractInstallmentsList.map((ele, index) => {
        return {
          ...ele,
          nextInstallment: index === 0 ? true : false,
          order: index + 1,
          contractId: contract._id,
          leadId: data.leadId,
        };
      });
      await ContractInstallment.insertMany(data.contractInstallmentsList);
    }

    return 'Contract created successfully';
  }
  async getDetails(_id) {
    const contract = await Contract.findOne({ leadId: _id }).populate('cityId villageId', 'nameEn nameAr url');
    if (!contract) return null;
    const { createdBy, createdAt, leadId, numberOfInstallments, ...result } = contract.toObject();
    if (contract.paymentMethod === ContractPaymentMethodEnum.Installments) {
      const contractInstallment = await ContractInstallment.findOne({ contractId: contract._id, nextInstallment: true });
      if (contractInstallment) {
        result.installmentAmount = contractInstallment.installmentAmount;
        result.nextInstallments = contractInstallment.installmentDate;
        result.contractInstallment = {
          _id: contractInstallment._id,
          order: contractInstallment.order,
          installmentAmount: contractInstallment.installmentAmount,
          installmentDate: contractInstallment.installmentDate,
        };
      }
    }
    if (result.cityId) {
      result.city = result.cityId;
      delete result.cityId;
    }
    if (result.villageId) {
      result.village = result.villageId;
      if (!result.villageId?.url) result.village.url = null;
      delete result.villageId;
    }

    return result;
  }

  async payInstallment(_id) {
    let status = ContractPaidStatusEnum.Pending;
    const currentInstallment = await ContractInstallment.findOne({ _id, nextInstallment: true });
    if (!currentInstallment) throw ErrorHandler.notFound({}, 'Contract installation not found');
    currentInstallment.nextInstallment = false;
    currentInstallment.status = ContractPaidStatusEnum.Done;
    await currentInstallment.save();

    const nextInstallment = await ContractInstallment.findOneAndUpdate(
      { order: currentInstallment.order + 1, leadId: currentInstallment.leadId, nextInstallment: false },
      { nextInstallment: true },
    );
    const contract = await Contract.findOne({ _id: currentInstallment.contractId });
    contract.totalPaid = Number(contract.totalPaid) + Number(currentInstallment.installmentAmount);
    contract.remainingAmount = Number(contract.remainingAmount) - Number(currentInstallment.installmentAmount);
    if (!nextInstallment) {
      contract.contractPaidStatus = ContractPaidStatusEnum.Done;
      status = ContractPaidStatusEnum.Done;
    }
    await contract.save();
    return status;
  }

  async createCustomPackage(data) {
    const exists = await Contract.findOne({ isCustomPackage: true });
    if (exists) throw ErrorHandler.badRequest({}, 'No packages left. Please contact support for assistance.');

    const existsLead = await User.findOne({ mobile: data.mobile });
    if (existsLead) throw ErrorHandler.badRequest({}, 'Mobile number already in use');
    const lead = new User({
      firstName: data.name,
      lastName: data.name,
      name: data.name,
      mobile: data.mobile,
      whatsappMobileNumber: data.whatsappMobileNumber,
      role: Roles.Lead,
      email: data?.email,
      nationalId: data?.nationalId,
      nationality: data?.nationality,
      getFrom: GetFromEnum.Form,
      contactMethod: ContactMethodEnum.Website,
      category: UserCategoryEnum.PremiumLead,
      address: ' ',
      ticketStatus: TicketStatusEnum.Done,
    });
    await lead.save();

    const village = await Village.findOne();
    data.villageId = village._id;
    data.cityId = village.cityId;

    data.leadId = lead._id;
    data.createdBy = lead._id;
    data.contractDate = new Date();
    data.membershipType = data.packageType;
    (data.unitType = 'A'), (data.individuals = 2);
    data.totalNights =
      data.packageType === PackageTypeEnum.Diamond ? 49 : data.packageType === PackageTypeEnum.Golden ? 30 : 70;
    data.remainingNights = data.totalNights;
    data.usageNights = 0;
    data.nightsCanUse = 7;
    data.totalAmount =
      data.packageType === PackageTypeEnum.Diamond ? 30000 : data.packageType === PackageTypeEnum.Golden ? 20000 : 50000;
    data.contractPaidStatus = ContractPaidStatusEnum.Done;
    data.totalPaid = data.totalAmount;
    data.startUsageWhenComplete = 1;
    if (data.paymentMethod === ContractPaymentMethodEnum.Installments) {
      data.contractPaidStatus = ContractPaidStatusEnum.Pending;
      data.downPayment = data.totalAmount / 2;
      data.totalInstallments = data.downPayment;
      data.remainingAmount = data.downPayment;
      data.totalPaid = data.downPayment;
    }

    const contract = new Contract(data);
    await contract.save();

    if (data.paymentMethod === ContractPaymentMethodEnum.Installments) {
      const installmentAmount = data.remainingAmount / 6;
      data.nextInstallment = new Date();
      data.nextInstallment.setMonth(data.nextInstallment.getMonth() + 1);
      data.contractInstallmentsList = [];
      for (let i = 0; i < 6; i++) {
        data.contractInstallmentsList.push({
          installmentAmount,
          installmentDate: new Date(data.nextInstallment),
          status: ContractPaidStatusEnum.Pending,
        });

        let nextDate = new Date(data.nextInstallment);
        nextDate.setMonth(nextDate.getMonth() + 1);

        // Ensure all time properties remain consistent
        data.nextInstallment = new Date(
          nextDate.getFullYear(),
          nextDate.getMonth(),
          nextDate.getDate(),
          nextDate.getHours(),
          nextDate.getMinutes(),
          nextDate.getSeconds(),
          nextDate.getMilliseconds(),
        );
      }
      const contractInstallmentsList = data.contractInstallmentsList.map((ele, index) => {
        return {
          ...ele,
          nextInstallment: index === 0 ? true : false,
          order: index + 1,
          contractId: contract._id,
          leadId: data.leadId,
        };
      });
      await ContractInstallment.insertMany(contractInstallmentsList);
      contract.installmentsType = installmentsTypeEnum.Monthly;
      contract.numberOfInstallments = 6;
      contract.installmentStartIn = data.contractInstallmentsList[0].installmentDate;
      contract.installmentEndsIn = data.contractInstallmentsList[5].installmentDate;
      await contract.save();
    }

    return 'Contract created successfully';
  }
}
module.exports = new ContractService();
