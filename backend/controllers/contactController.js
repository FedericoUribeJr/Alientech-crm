const Contact = require("../models/contactModel");
const validator = require("validator");

// Crear un nuevo contacto
const createContact = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      whatsapp,
      status,
      prospectingInfo,
      shippingInfo,
    } = req.body;

    // Validaciones adicionales (reforzando el schema)
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (phone && !validator.isMobilePhone(phone)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }
    if (whatsapp && !validator.isMobilePhone(whatsapp)) {
      return res.status(400).json({ error: "Invalid WhatsApp number" });
    }
    if (
      shippingInfo?.shippingEmail &&
      !validator.isEmail(shippingInfo.shippingEmail)
    ) {
      return res.status(400).json({ error: "Invalid shipping email" });
    }
    if (
      shippingInfo?.shippingPhone &&
      !validator.isMobilePhone(shippingInfo.shippingPhone)
    ) {
      return res.status(400).json({ error: "Invalid shipping phone" });
    }

    const newContact = new Contact({
      firstName,
      lastName,
      email,
      phone,
      whatsapp,
      status,
      prospectingInfo,
      shippingInfo,
    });

    await newContact.save();
    res
      .status(201)
      .json({ message: "Contacto creado exitosamente", contact: newContact });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los contactos
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({});
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un contacto por ID
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: "Contacto no encontrado" });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un contacto
const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validaciones adicionales para updates
    if (updates.email && !validator.isEmail(updates.email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (updates.phone && !validator.isMobilePhone(updates.phone)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }
    if (updates.whatsapp && !validator.isMobilePhone(updates.whatsapp)) {
      return res.status(400).json({ error: "Invalid WhatsApp number" });
    }
    if (
      updates.shippingInfo?.shippingEmail &&
      !validator.isEmail(updates.shippingInfo.shippingEmail)
    ) {
      return res.status(400).json({ error: "Invalid shipping email" });
    }
    if (
      updates.shippingInfo?.shippingPhone &&
      !validator.isMobilePhone(updates.shippingInfo.shippingPhone)
    ) {
      return res.status(400).json({ error: "Invalid shipping phone" });
    }

    const updatedContact = await Contact.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedContact) {
      return res.status(404).json({ error: "Contacto no encontrado" });
    }
    res
      .status(200)
      .json({
        message: "Contacto actualizado exitosamente",
        contact: updatedContact,
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un contacto
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: "Contacto no encontrado" });
    }
    res.status(200).json({ message: "Contacto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};
