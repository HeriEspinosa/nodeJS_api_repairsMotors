const Repair = require('../models/repair.model');

exports.validCreateRepair = async (req, res, next) => {
    const { date, userId, motorsNumber } = req.body;

    const newDate = new Date(date);

    try {
        const repair = await Repair.findOne({
            where: {
                date: newDate,
                userId,
                motorsNumber,
            },
        });

        if (repair) {
            return res.status(400).json({
                status: 'error',
                message: `this user ${userId} already a ticket with the same specifications`,
                repair,
            });
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
};

exports.validExistRepair = async (req, res, next) => {
    const { id } = req.params;
    try {
        const repair = await Repair.findOne({
            where: {
                id,
                status: 'pending',
            },
        });

        if (!repair) {
            return res.status(404).json({
                status: 'error',
                message: `Ops! does not have repair ticket with id: ${id} 🤕`,
            });
        }

        req.repair = repair;
        next();
    } catch (error) {
        console.log(error.message);
    }
};

exports.validDeleteRepair = async (req, res, next) => {
    const { id } = req.params;

    try {
        const repair = await Repair.findOne({
            where: {
                id,
                status: 'pending',
            },
        });

        if (!repair) {
            return res.status(404).json({
                status: 'error',
                message: `The repair with id: ${id} cannot delete`,
            });
        }

        req.repair = repair;
        next();
    } catch (error) {
        console.log(error.message);
    }
};
