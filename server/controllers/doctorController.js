import Doctor from "../models/doctorModel.js";


// API to change doctor availability
const changeAvailablity = async (req, res) => {

    try {

        const { docId } = req.body;

        if (!docId) {
            return res.status(400).json({
                success: false,
                message: "Doctor ID is required"
            });
        }

        const docData = await Doctor.findById(docId);

        if (!docData) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found" 
            });
        }

        await Doctor.findByIdAndUpdate(
            docId,
            { available: !docData.available }
        );

        res.json({
            success: true,
            message: "Availability changed"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// API to get doctors list
const doctorList = async (req, res) => {

    try {

        const doctors = await Doctor
            .find({})
            .select('-password -email');

        res.json({
            success: true,
            doctors
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export {
    changeAvailablity,
    doctorList
};