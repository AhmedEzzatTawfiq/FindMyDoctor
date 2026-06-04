import jwt from "jsonwebtoken";

const authCrm = async (req, res, next) => {
    try {
        const { dtoken, stoken } = req.headers;

        if (!dtoken && !stoken) {
            return res.status(401).json({ success: false, message: "Not authorized, login again" });
        }

        if (dtoken) {
            // Authenticate Doctor
            const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
            if (!req.body) req.body = {};
            req.body.docId = token_decode.id;
            req.role = "doctor";
            req.doctorId = token_decode.id;
            next();
        } else if (stoken) {
            // Authenticate Staff
            const token_decode = jwt.verify(stoken, process.env.JWT_SECRET);
            if (!req.body) req.body = {};
            req.body.docId = token_decode.doctorId;
            req.role = "staff";
            req.staffId = token_decode.id;
            req.doctorId = token_decode.doctorId;
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Authentication failed: " + error.message });
    }
};

export default authCrm;
