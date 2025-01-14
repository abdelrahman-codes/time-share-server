const mongoose = require('mongoose');

const villageSchema = mongoose.Schema(
  {
    nameAr:{type: String},
    nameEn:{type: String},
    normalizedNameAr: { type: String },
    normalizedNameEn: { type: String },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  },
  {
    timestamps: true,
  },
);

villageSchema.pre('save', async function (next) {
  this.normalizedNameAr = this.nameAr.toLowerCase();
  this.normalizedNameEn = this.nameEn.toLowerCase();

  next();
});

villageSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.nameAr) {
    update.normalizedNameAr = update.nameAr.toLowerCase();
  }
  if (update.nameEn) {
    update.normalizedNameEn = update.nameEn.toLowerCase();
  }

  next();
});



const Village = mongoose.models.Village || mongoose.model('Village', villageSchema);
module.exports = Village;
