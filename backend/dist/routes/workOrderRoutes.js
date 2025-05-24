"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workOrderController_1 = require("../controllers/workOrderController");
const router = (0, express_1.Router)();
// Async handler utility to forward errors to Express
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
router.get('/', asyncHandler(workOrderController_1.getAllWorkOrders));
router.post('/', asyncHandler(workOrderController_1.createWorkOrder));
router.get('/:id', asyncHandler(workOrderController_1.getOneWorkOrder));
router.put('/:id', asyncHandler(workOrderController_1.updateWorkOrder));
router.delete('/:id', asyncHandler(workOrderController_1.deleteWorkOrder));
exports.default = router;
