const express = require("express");
const {
  getAllContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact
} = require("../../controllers/contactController");
const { protect } = require("../../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getAllContacts).post(protect, createContact);
router.route("/:id").get(protect, getContactById).put(protect, updateContact).delete(protect, deleteContact);

module.exports = router;
