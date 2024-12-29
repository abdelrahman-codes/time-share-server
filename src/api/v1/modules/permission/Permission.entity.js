const mongoose = require('mongoose');

const permissionSchema = mongoose.Schema(
  {
    module: { type: String, trim: true },
    feature: { type: String, trim: true },
    accessLevel: { type: String, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

const Permission = mongoose.models.Permission || mongoose.model('Permission', permissionSchema);
module.exports = Permission;
