import Doctor from "../models/doctorModel.js"



const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body
        const docData = await Doctor.findById(docId)
        await Doctor.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availabilty changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const doctorList = async (req, res) => {
    try {

        const doctors = await Doctor.find({}).select(['-password', '-email'])
        res.json({success:true, doctors})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { changeAvailablity, doctorList };