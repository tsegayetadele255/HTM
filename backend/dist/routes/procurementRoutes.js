"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const procurementController_1 = require("../controllers/procurementController");
const router = (0, express_1.Router)();
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
router.get('/', asyncHandler(procurementController_1.getAllProcurementRecords));
router.post('/', asyncHandler(procurementController_1.createProcurementRecord));
router.get('/:id', asyncHandler(procurementController_1.getOneProcurementRecord));
router.put('/:id', asyncHandler(procurementController_1.updateProcurementRecord));
router.delete('/:id', asyncHandler(procurementController_1.deleteProcurementRecord));
exports.default = router;
