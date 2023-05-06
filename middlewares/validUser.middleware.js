const Repair = require('../models/repair.model');
const User = require('../models/user.model');

exports.validCreateUser = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({
            where: {
                email,
            },
        });

        if (user) {
            return res.status(400).json({
                status: 'error',
                message: `This email ${email} already exists`,
            });
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
};

exports.validExistUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({
            where: {
                id,
                status: 'available',
            },
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: `Ops! the user with id: ${id}, not found 🤕`,
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
    }
};

exports.validLoginUser = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({
            where: {
                email: email.toLowerCase().trim(),
                status: 'available',
            },
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: `Ops!, this email ${email} not exist, you must register`,
            });
        }

        req.login = user;
        next();
    } catch (error) {
        console.log(error.message);
    }
};
