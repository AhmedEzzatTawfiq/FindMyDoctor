import jwt from "jsonwebtoken";

// API for staff login
const staffLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check credentials
        if (
            email === process.env.STAFF_EMAIL &&
            password === process.env.STAFF_PASSWORD
        ) {
            const token = jwt.sign(
                { email },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            return res.json({
                success: true,
                token
            });
        }

        res.status(400).json({
            success: false,
            message: "Invalid credentials"
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
    staffLogin
};
