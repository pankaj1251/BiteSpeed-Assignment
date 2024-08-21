const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");

router.post("/", async (req, res) => {
  const { email, phoneNumber } = req.body;

  try {
    let primaryContact = await Contact.findOne({
      $or: [
        { email: email, phoneNumber: { $ne: phoneNumber } },
        { phoneNumber: phoneNumber, email: { $ne: email } },
      ],
    });

    if (primaryContact) {
      const secondaryContact = await Contact.create({
        phoneNumber: phoneNumber,
        email: email,
        linkedId: primaryContact._id,
        linkPrecedence: "secondary",
      });

      primaryContact.updatedAt = Date.now();
      await primaryContact.save();

      return res.status(200).json({
        contact: {
          primaryContactId: primaryContact._id,
          emails: [primaryContact.email, email].filter(Boolean),
          phoneNumbers: [primaryContact.phoneNumber, phoneNumber].filter(
            Boolean
          ),
          secondaryContactIds: [secondaryContact._id],
        },
      });
    } else {
      const newContact = await Contact.create({
        phoneNumber: phoneNumber,
        email: email,
        linkPrecedence: "primary",
      });

      return res.status(200).json({
        contact: {
          primaryContactId: newContact._id,
          emails: [email].filter(Boolean),
          phoneNumbers: [phoneNumber].filter(Boolean),
          secondaryContactIds: [],
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "An error occurred." });
  }
});

module.exports = router;
