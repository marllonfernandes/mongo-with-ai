const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
      required: false,
      index: true,
      unique: false,
    },
    email: {
      type: String,
      default: "",
      required: false,
      index: true,
      unique: false,
    },
    status: {
      type: String,
      default: "",
      required: false,
      index: true,
      unique: false,
    },
    isAdmin: {
      type: Boolean,
      required: false,
      index: true,
      unique: false,
    },
    idOtherApplication: {
      type: String,
      default: "",
      required: false,
      index: true,
      unique: false,
    },
  },
  { timestamps: true }
);

// exportar o schema em formato JSON
const userSchemaJson = {};

  // Iterando sobre os campos do schema e extraindo o nome e tipo
  for (const field in userSchema.obj) {
    if (userSchema.obj.hasOwnProperty(field)) {
      userSchemaJson[field] = userSchema.obj[field].type.name;
    }
  }
  userSchemaJson["createdAt"] = "String"
  userSchemaJson["updatedAt"] = "String"

const User = mongoose.model("User", userSchema);

module.exports = { User, userSchemaJson }