const express = require('express');

//MIDDLEWARES
const {
    validExistUser,
    validCreateUser,
    validLoginUser,
} = require('../middlewares/validUser.middleware');
const {
    createUserValidations,
    loginUserValidations,
} = require('../middlewares/validations.middleware');
const {
    protect,
    restricTo,
    protectAccountOwner,
} = require('../middlewares/protect.middleware');

//CONTROLLERS
const {
    findAllUsers,
    createUser,
    findOneUser,
    updateUser,
    deleteUser,
    loginUser,
    findAllUsersAdmin,
} = require('../controllers/users.controller');

//ROUTES
const router = express.Router();

router.post(
    '/login',
    loginUserValidations,
    validLoginUser,
    loginUser
);

router
    .route('/')
    .get(protect, findAllUsers)
    .post(createUserValidations, validCreateUser, createUser);

router.use(protect);

router.get('/admin', restricTo('admin'), findAllUsersAdmin);

router
    .route('/:id')
    .get(validExistUser, findOneUser)
    .patch(
        validExistUser,
        protectAccountOwner,
        restricTo('admin'),
        updateUser
    )
    .delete(
        validExistUser,
        protectAccountOwner,
        restricTo('admin'),
        deleteUser
    );

module.exports = router;
