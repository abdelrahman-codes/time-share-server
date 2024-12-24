const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Roles = require('../../../../enums/roles');

const userSchema = mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true, unique: true, index: true, required: true },
    password: { type: String, trim: true },
    phone: { type: String, trim: true, unique: true },

    dob: { type: Date },
    gender: { type: String },
    profileImage: { type: String, trim: true },

    // profile privacy setting
    otp: { type: Number },
    forgetCode: { type: Number },
    forgetPassword: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    role: { type: String, default: Roles.User },
    active: { type: Boolean, default: true },
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
  // Generate a new OTP for user registration
  this.otp = Math.floor(1000 + Math.random() * 9000);
  next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    update.password = await bcrypt.hash(update.password, Number(process.env.SALT_ROUNDS));
  }
  update.otp = Math.floor(1000 + Math.random() * 9000);
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
