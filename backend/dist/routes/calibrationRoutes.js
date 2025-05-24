"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const calibrationController_1 = require("../controllers/calibrationController");
const router = (0, express_1.Router)();
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
router.get('/', asyncHandler(calibrationController_1.getAllCalibrationRecords));
router.post('/', asyncHandler(calibrationController_1.createCalibrationRecord));
router.get('/:id', asyncHandler(calibrationController_1.getOneCalibrationRecord));
router.put('/:id', asyncHandler(calibrationController_1.updateCalibrationRecord));
router.delete('/:id', asyncHandler(calibrationController_1.deleteCalibrationRecord));
exports.default = router;
