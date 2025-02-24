const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Roles = require('../../../../enums/roles');

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    name: { type: String, trim: true },
    username: { type: String, trim: true, unique: true, index: true, sparse: true },
    email: { type: String, trim: true, default: null },
    password: { type: String, trim: true },
    mobile: { type: String, trim: true },
    whatsappMobileNumber: { type: String, trim: true },
    rule: { type: String, trim: true },
    nationality: { type: String, trim: true },
    nationalId: { type: String, trim: true },
    getFrom: { type: String, trim: true },
    contactMethod: { type: String, trim: true },
    ticketStatus: { type: String, trim: true },
    address: { type: String, trim: true },
    category: { type: String, trim: true },
    url: { type: String, trim: true, default: null },

    // profile privacy setting
    role: { type: String, default: Roles.Lead },
    active: { type: Boolean, default: true },
    newNotification: { type: Boolean, default: false },
    fcmToken: { type: String, trim: true },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  // Hash the password before saving
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, Number(process.env.SALT_ROUNDS));
  }
  if (!this.isModified('name')) {
    this.name = `${this.firstName} ${this.lastName}`;
  }
  next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    update.password = await bcrypt.hash(update.password, Number(process.env.SALT_ROUNDS));
  }
  if (update.firstName || update.lastName) {
    const query = this.getQuery();
    const docToUpdate = await this.model.findOne(query).exec();

    const firstName = update.firstName || docToUpdate.firstName;
    const lastName = update.lastName || docToUpdate.lastName;

    update.name = `${firstName || ''} ${lastName || ''}`.trim();
  }
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
