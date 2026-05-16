import JWT from 'jsonwebtoken'

const authDoctor = async (req, res, next) => {
    try {
        const {dToken} = req.headers;
        if (!dToken) {
            return res.json({success: false, message: "not authorized"})
        }
        const token_decode = JWT.verify(dToken, )
    }
}