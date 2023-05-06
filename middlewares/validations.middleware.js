const { body, validationResult } = require('express-validator');

const validFields = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            errors: errors.mapped(),
        });
    }

    next();
};

exports.createUserValidations = [
    body('name').notEmpty().withMessage('Name cannot be empty'),
    body('email')
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Must be a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password cannot be empty')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    validFields,
];

exports.loginUserValidations = [
    body('email')
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Must be a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password cannot be empty')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    validFields,
];

exports.createRepairValidations = [
    body('date').notEmpty().withMessage('Date cannot empty'),
    body('motorsNumber')
        .notEmpty()
        .withMessage('Motors Number cannot empty')
        .isLength({ min: 5 })
        .withMessage(
            'Motors number must be at least 8 characters long'
        )
        .isNumeric()
        .withMessage('Must be a valid Motors number'),
    body('description')
        .notEmpty()
        .withMessage('Description cannot be empty'),
    validFields,
];
