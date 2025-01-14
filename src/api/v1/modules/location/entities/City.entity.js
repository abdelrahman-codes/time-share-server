const mongoose = require('mongoose');

const citySchema = mongoose.Schema(
  {
    nameAr: { type: String },
    nameEn: { type: String },
    normalizedNameAr: { type: String },
    normalizedNameEn: { type: String },
  },
  {
    timestamps: true,
  },
);

citySchema.pre('save', async function (next) {
  this.normalizedNameAr = this.nameAr.toLowerCase();
  this.normalizedNameEn = this.nameEn.toLowerCase();

  next();
});

citySchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.nameAr) {
    update.normalizedNameAr = update.nameAr.toLowerCase();
  }
  if (update.nameEn) {
    update.normalizedNameEn = update.nameEn.toLowerCase();
  }

  next();
});

const City = mongoose.models.City || mongoose.model('City', citySchema);
module.exports = City;
