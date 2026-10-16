const Address = require("../model/addressModel");


const addAddress = async (req, res) => {
    try {
        const { fullName, phoneNumber, streetAddress, city, state, pincode, isDefault } = req.body;

        const address = await Address.create({
            user: req.user.id, // from token
            fullName,
            phoneNumber,
            streetAddress,
            city,
            state,
            pincode,
            isDefault
        });

        res.status(201).json(address);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getAddress = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user.id });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteAddress = async (req, res) => {
    try {
        await Address.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    await Address.updateMany(
      { user: userId },
      { isDefault: false }
    );

    await Address.findByIdAndUpdate(
      addressId,
      { isDefault: true }
    );

    res.json({ message: "Default address updated" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      streetAddress,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;

    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    address.fullName = fullName;
    address.phoneNumber = phoneNumber;
    address.streetAddress = streetAddress;
    address.city = city;
    address.state = state;
    address.pincode = pincode;

    if (isDefault === true) {
      await Address.updateMany(
        { user: req.user.id },
        { isDefault: false }
      );

      address.isDefault = true;
    } else if (isDefault === false) {
      address.isDefault = false;
    }

    await address.save();

    res.json({
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addAddress, getAddress, deleteAddress, setDefaultAddress,updateAddress };