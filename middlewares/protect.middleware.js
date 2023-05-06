const User = require('../models/user.model');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
    let token;

    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        //VALIDAR SI EXISTE EL TOKEN
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message:
                    'You are not logged in!, Please log in to get access',
            });
        }

        //DECODIFICAR EL JWT
        const decoded = await promisify(jwt.verify)(
            token,
            process.env.SECRET_JWT_SEED
        );

        const user = await User.findOne({
            where: {
                id: decoded.id,
                status: 'available',
            },
        });

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Ops!, this token is no longer available',
            });
        }

        if (user.passwordChangedAt) {
            const changedTimeStamp = parseInt(
                user.passwordChangedAt.getTime() / 1000,
                10
            );
            if (decoded.iat < changedTimeStamp) {
                return res.status(401).json({
                    status: 'error',
                    message:
                        'User recently changed password, please login again',
                });
            }
        }

        req.userInSection = user;
        next();
    } catch (error) {
        console.log(error.message);
    }
};

exports.protectAccountOwner = async (req, res, next) => {
    const { user, userInSection } = req;

    if (user.id !== userInSection.id) {
        return res.status(401).json({
            status: 'error',
            message: 'You do not own this account',
        });
    }
    next();
};

exports.restricTo = (...role) => {
    try {
        return (req, res, next) => {
            if (!role.includes(req.userInSection.role)) {
                return res.status(403).json({
                    status: 'error',
                    message:
                        'Ops!, you do not permission to perform this action',
                });
            }
            next();
        };
    } catch (error) {
        console.log(error.message);
    }
};
