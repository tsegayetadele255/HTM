"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trainingController_1 = require("../controllers/trainingController");
const router = (0, express_1.Router)();
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
router.get('/', asyncHandler(trainingController_1.getAllTrainingRecords));
router.post('/', asyncHandler(trainingController_1.createTrainingRecord));
router.get('/:id', asyncHandler(trainingController_1.getOneTrainingRecord));
router.put('/:id', asyncHandler(trainingController_1.updateTrainingRecord));
router.delete('/:id', asyncHandler(trainingController_1.deleteTrainingRecord));
exports.default = router;
