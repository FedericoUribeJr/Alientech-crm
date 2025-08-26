const mongoose = require("mongoose");
const validator = require("validator");

const getStageNumber = (value) => {
  if (!value) return NaN;
  const parts = value.split(".-");
  return parts.length > 1 ? parseInt(parts[0], 10) : NaN;
};

const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email format"],
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || validator.isMobilePhone(v);
        },
        message: "Invalid phone number",
      },
    },
    whatsapp: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || validator.isMobilePhone(v);
        },
        message: "Invalid WhatsApp number",
      },
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: [
          "01.- Contact",
          "02.- Lead",
          "03.- Customer",
          "04.- Alientech",
          "05.- Distributor",
          "06.- Zombie",
          "07.- Dead",
        ],
        message: "{VALUE} is not a valid status",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    prospectingInfo: {
      origin: {
        type: String,
        enum: {
          values: [
            "WhatsApp",
            "Facebook",
            "Instagram",
            "Email",
            "WebPage",
            "Alientech",
            "Expo",
            "Referred",
            "Incoming Call",
          ],
          message: "{VALUE} is not a valid origin",
        },
      },
      lifecycleStage: {
        type: String,
        enum: {
          values: [
            "01.- Contact",
            "02.- Lead",
            "03.- Nurturing",
            "04.- Opportunity",
            "05.- Stalled Opportunity",
            "06.- Customer",
            "07.- Recurring Customer",
            "08.- Distributor",
          ],
          message: "{VALUE} is not a valid lifecycle stage",
        },
      },
      prospectInterests: {
        type: [String],
        validate: {
          validator: function (v) {
            const validInterests = [
              "Kess3",
              "Ecm Titanium",
              "Curso",
              "Accesorios",
              "Protocolos Adicionales",
              "Renovacion Kess3",
              "Renovacion ECM Titanium",
              "Actualizacion a Master",
              "Actualizacion a Full ECM Titanium",
              "Equipo Adicional",
              "Creditos ECM Titanium",
              "PowerGate",
              "Creditos PowerGate",
              "Trade-In",
            ];
            return v.every((interest) => validInterests.includes(interest));
          },
          message: "Invalid prospect interest(s)",
        },
      },
      prospectCreatedAt: {
        type: Date,
        default: Date.now,
        immutable: true,
      },
    },
    shippingInfo: {
      shippingFirstName: {
        type: String,
        trim: true,
      },
      shippingLastName: {
        type: String,
        trim: true,
      },
      shippingEmail: {
        type: String,
        lowercase: true,
        validate: {
          validator: function (v) {
            return !v || validator.isEmail(v);
          },
          message: "Invalid shipping email",
        },
      },
      shippingPhone: {
        type: String,
        validate: {
          validator: function (v) {
            return !v || validator.isMobilePhone(v);
          },
          message: "Invalid shipping phone",
        },
      },
      street: {
        type: String,
        trim: true,
      },
      neighborhood: {
        type: String,
        trim: true,
      },
      municipality: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      postalCode: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

// Hooks para validación de progresión en status y lifecycleStage
const validateProgression = async function (next) {
  const update = this.getUpdate();
  const query = this.getQuery();

  // Obtener documento actual
  const doc = await this.model.findOne(query);

  if (!doc) return next();

  // Validar status
  if (update.status && update.status !== doc.status) {
    const currentNum = getStageNumber(doc.status);
    const newNum = getStageNumber(update.status);
    if (isNaN(newNum) || newNum <= currentNum) {
      return next(new Error("Cannot revert status to a previous stage"));
    }
  }

  // Validar lifecycleStage
  if (
    update["prospectingInfo.lifecycleStage"] &&
    update["prospectingInfo.lifecycleStage"] !==
      doc.prospectingInfo.lifecycleStage
  ) {
    const currentNum = getStageNumber(doc.prospectingInfo.lifecycleStage);
    const newNum = getStageNumber(update["prospectingInfo.lifecycleStage"]);
    if (isNaN(newNum) || newNum <= currentNum) {
      return next(
        new Error("Cannot revert lifecycle stage to a previous stage")
      );
    }
  }

  next();
};

contactSchema.pre("findOneAndUpdate", validateProgression);
contactSchema.pre("updateOne", validateProgression);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
