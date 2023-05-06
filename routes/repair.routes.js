const express = require('express');

//MIDDLEWARES
const {
    validExistRepair,
    validCreateRepair,
    validDeleteRepair,
} = require('../middlewares/validRepair.middleware');
const {
    createRepairValidations,
} = require('../middlewares/validations.middleware');
const {
    protect,
    restricTo,
} = require('../middlewares/protect.middleware');

//CONTROLLERS
const {
    findAllRepairs,
    createRepair,
    findOneRepair,
    updateRepair,
    deleteRepair,
    findAllRepairsAdmin,
} = require('../controllers/repair.controller');

const router = express.Router();

router
    .route('/')
    .get(protect, restricTo('employee'), findAllRepairs)
    .post(createRepairValidations, validCreateRepair, createRepair);

router.use(protect);

router.get('/admin', restricTo('admin'), findAllRepairsAdmin);

router
    .route('/:id')
    .get(validExistRepair, restricTo('employee'), findOneRepair)
    .patch(validExistRepair, restricTo('employee'), updateRepair)
    .delete(validDeleteRepair, restricTo('admin'), deleteRepair);

module.exports = router;
