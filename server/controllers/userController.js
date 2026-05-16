import User from "../models/UserModel.js"

export const getUserData = async (req, res) => {
    try {
        // Implement get user data logic here
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message })
    }
}