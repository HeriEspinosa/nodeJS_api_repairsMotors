const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/generateToken');
const Repair = require('../models/repair.model');

exports.findAllUsersAdmin = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                status: 'available',
            },
            include: [
                {
                    model: Repair,
                    attributes: { exclude: ['id', 'userId'] },
                },
            ],
        });

        return res.status(200).json({
            status: 'success',
            results: users.length,
            users,
        });
    } catch (error) {
        console.log(error.message);
    }
};

exports.findAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                status: 'available',
            },
            attributes: {
                exclude: ['password', 'passwordChangedAt', 'status'],
            },
        });

        return res.status(200).json({
            status: 'success',
            results: users.length,
            users,
        });
    } catch (error) {
        console.log(error.message);
    }
};

exports.findOneUser = async (req, res) => {
    const { id } = req.user;
    try {
        const user = await User.findOne({
            where: {
                id,
                status: 'available',
            },
            include: [
                {
                    model: Repair,
                    attributes: { exclude: ['userId'] },
                },
            ],
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: `Ops! the user with id: ${id}, not found 🤕`,
            });
        }

        let resultRepairs = user.repairs.map((repair) => ({
            idRepair: repair.id,
            date: repair.date,
            motorsNumber: repair.motorsNumber,
            description: repair.description,
            statusRepair: repair.statusRepair,
            createdAt: repair.createdAt,
            updatedAt: repair.updatedAt,
            workDone: repair.workDone,
        }));

        console.log(user.repairs);

        return res.status(200).json({
            status: 'success',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                repairs: resultRepairs,
            },
        });
    } catch (error) {
        console.log(error.message);
    }
};

exports.createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const salt = await bcrypt.genSalt(12);
        const encryptedPass = await bcrypt.hash(password, salt);

        const user = await User.create({
            name: name.toLowerCase().trim(),
            email: email.toLowerCase().trim(),
            password: encryptedPass,
            role,
        });

        const token = await generateJWT(user.id);

        return res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.log(error.message);
    }
};

exports.updateUser = async (req, res) => {
    const { name, email } = req.body;
    const { user } = req;

    try {
        console.log(user);

        if (user.name === name && user.email === email) {
            return res.status(200).json({
                status: 'ok',
                message: `The name: '${name}' and email: '${email}' already exists`,
            });
        } else {
            await user.update({
                name,
                email,
            });
        }

        res.status(200).json({
            status: 'success',
            message: `The user with id:${user.id} updated successfully`,
        });
    } catch (error) {
        console.log(error.message);
    }
};

exports.deleteUser = async (req, res) => {
    const user = req.user;

    try {
        await user.update({
            status: 'disabled',
        });

        return res.status(200).json({
            status: 'success',
            message: `🫡 User ${user.name} deleted successfully. Goodbye!`,
        });
    } catch (error) {
        console.log(error.message);
    }
};

exports.loginUser = async (req, res) => {
    const user = req.login;
    const { password } = req.body;

    try {
        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                status: 'error',
                message: 'Ops!, incorrect email or password',
            });
        }

        const token = await generateJWT(user.id);

        return res.status(200).json({
            status: 'success',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.log(error.message);
    }
};
