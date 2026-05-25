import jwt from "jsonwebtoken"

// User Auth
const authUser = async (req, res, next) => {
    try {
        const {token} = req.headers;

        if(!token){
            return res.status(400).json({success:false, message:"Not authorized"})
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!req.body) req.body = {};
        req.body.userId = token_decode.id
        next();

        
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
}

export default authUser;