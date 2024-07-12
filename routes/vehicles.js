const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const nodemailer = require('nodemailer');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');

// Email setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bilalsaeed20@gmail.com', // Replace with your email
        pass: 'tangstar' // Replace with your email password
    }
});

// Function to generate PDF
async function generatePDF(vehicleData) {
    try {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();

        page.drawText('Vehicle Details', {
            x: 50,
            y: height - 50,
            size: 24,
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
            color: rgb(0, 0, 0),
        });

        const details = `
            First Name: ${vehicleData.firstName}
            Last Name: ${vehicleData.lastName}
            Email: ${vehicleData.email}
            Phone: ${vehicleData.phone}
            Address: ${vehicleData.address}
            Vehicle Brand: ${vehicleData.vehicleBrand}
            Chesis Number: ${vehicleData.chesisNumber}
        `;

        page.drawText(details, {
            x: 50,
            y: height - 150,
            size: 12,
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
            color: rgb(0, 0, 0),
        });

        const pdfBytes = await pdfDoc.save();
        const filePath = `vehicle_${vehicleData._id}.pdf`;
        fs.writeFileSync(filePath, pdfBytes);
        return filePath;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF');
    }
}

// Add a new vehicle entry
router.post('/', async (req, res) => {
    const { firstName, lastName, email, phone, address, vehicleBrand, chesisNumber } = req.body;
    try {
        const vehicle = new Vehicle({ firstName, lastName, email, phone, address, vehicleBrand, chesisNumber });
        await vehicle.save();

        // Generate PDF
        const pdfPath = await generatePDF(vehicle);

        // Email PDF
        const mailOptions = {
            from: 'bilalsaeed20b@gmail.com', // Replace with your email
            to: email, // Send to the same person
            subject: 'Vehicle Details PDF',
            text: `Dear ${firstName} ${lastName},\n\nYour vehicle details have been added successfully.\n\nPlease find attached PDF with details.\n\nThank you!`,
            attachments: [{ filename: 'vehicle_details.pdf', path: pdfPath }]
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Email sending error:', error);
                return res.status(500).send(error.toString());
            }
            res.status(201).json(vehicle);
        });
    } catch (err) {
        console.log('Error saving vehicle:', err.message);
        res.status(500).json({ error: err.message });
    }
});




// Get all vehicles
router.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Update a vehicle entry
router.put('/:id', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, address, vehicleBrand, chesisNumber } = req.body;
        const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, { firstName, lastName, email, phone, address, vehicleBrand, chesisNumber }, { new: true });
        if (!updatedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(updatedVehicle);
    } catch (err) {
        console.error('Error updating vehicle:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete a vehicle entry
router.delete('/:id', async (req, res) => {
    try {
        const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!deletedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (err) {
        console.error('Error deleting vehicle:', err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
