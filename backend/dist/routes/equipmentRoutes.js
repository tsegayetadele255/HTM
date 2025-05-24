"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const equipmentController_1 = require("../controllers/equipmentController");
const router = (0, express_1.Router)();
// Async handler utility to forward errors to Express
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
router.get('/', asyncHandler(equipmentController_1.getAllEquipment));
router.post('/', asyncHandler(equipmentController_1.createEquipment));
router.get('/:id', asyncHandler(equipmentController_1.getOneEquipment));
router.put('/:id', asyncHandler(equipmentController_1.updateEquipment));
router.delete('/:id', asyncHandler(equipmentController_1.deleteEquipment));
exports.default = router;
