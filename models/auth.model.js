const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');


const authSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 50, trim: true },
    description: { type: String, required: true, maxlength: 500, trim: true },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
  },
  { timestamps: true }
);

authSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

authSchema.set("toJSON", {
  virtuals: false,
});


authSchema.plugin(mongoosePaginate);
const auth = mongoose.model("Auth", authSchema);
module.exports = auth;