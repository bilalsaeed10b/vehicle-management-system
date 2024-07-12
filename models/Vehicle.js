const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    vehicleBrand: String,
    chesisNumber: String
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
