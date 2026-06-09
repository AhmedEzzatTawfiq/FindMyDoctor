import jwt from "jsonwebtoken"

// Staff Auth
const authStaff = async (req, res, next) => {
    try {
        const {atoken} = req.headers;

        if(!atoken){
            return res.status(400).json({success:false, message:"Not authorized"})
        }

        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
        if(token_decode.email !== process.env.STAFF_EMAIL){
            return res.status(400).json({success:false, message:"Not authorized"})
        }

        next();

        
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
}

export default authStaff;
