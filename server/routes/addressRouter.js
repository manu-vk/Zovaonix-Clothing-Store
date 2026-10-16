const express = require("express");
const protect = require("../middleware/authMiddleware");
const { addAddress, getAddress, deleteAddress, setDefaultAddress,updateAddress, } = require("../controllers/addressController");

const router = express.Router();

router.post("/", protect, addAddress);
router.get("/", protect, getAddress);
router.put("/default/:id", protect, setDefaultAddress);
router.delete("/:id", protect, deleteAddress);
router.put("/:id", protect, updateAddress);
module.exports = router;