const Repair = require('../models/repair.model');
const User = require('../models/user.model');

exports.findAllRepairs = async (req, res) => {
    try {
        const repairs = await Repair.findAll({
            where: {
                status: 'pending',
            },
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: [
                            'id',
                            'password',
                            'passwordChangedAt',
                            'role',
                        ],
                    },
                },
            ],
        });

        if (!repairs[0]) {
            return res.status(200).json({
                status: 'success',
                message: 'Sorry, not exist ticket now',
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'All pending Appointments',
            results: repairs.length,
            repairs,
        });
    } catch (error) {
        console.log(error.message);
    }
};

exports.findAllRepairsAdmin = async (req, res) => {
    try {
        const repairs = await Repair.findAll({
            where: {},
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: [
                            'id',
                            'password',
                            'passwordChangedAt',
                            'role',
                            'createdAt',
                            'updatedAt',
                        ],
                    },
                },
            ],
        });

        if (!repairs[0]) {
            return res.status(200).json({
                status: 'success',
                message: 'Sorry, not exist ticket now',
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'All pending Appointments',
            results: repairs.length,
            repairs,
        });
    } catch (error) {
        console.log(error.message);
    }
};

exports.findOneRepair = async (req, res) => {
    const {
        date,
        userId,
        status,
        motorsNumber,
        description,
        workDone,
    } = req.repair;

    return res.status(200).json({
        status: 'success',
        message: 'We are working on your repair',
        repair: {
            status,
            date,
            userId,
            motorsNumber,
            description,
            workDone,
        },
    });
};

exports.createRepair = async (req, res) => {
    const { date, userId, motorsNumber, description } = req.body;

    const repair = await Repair.create({
        date,
        userId,
        motorsNumber,
        description,
    });

    res.status(201).json({
        status: 'success',
        message: 'Repair ticket created successfully',
        repair,
    });
};

exports.updateRepair = async (req, res) => {
    const { status } = req.repair;
    const repair = req.repair;
    const { workDone } = req.body;

    await repair.update({
        status: 'completed',
        workDone,
    });

    return res.status(200).json({
        status: 'success',
        message: 'Congratulations, this repair now completed',
        repair,
    });
};

exports.deleteRepair = async (req, res) => {
    const repair = req.repair;

    await repair.update({
        status: 'cancelled',
    });

    return res.status(200).json({
        status: 'success',
        message: `Sorry for inconvenience!, the reparis with id: ${repair.id} has be cancelled`,
    });
};
