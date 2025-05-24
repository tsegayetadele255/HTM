"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sparePartController_1 = require("../controllers/sparePartController");
const router = (0, express_1.Router)();
// Async handler utility to forward errors to Express
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
router.get('/', asyncHandler(sparePartController_1.getAllSpareParts));
router.post('/', asyncHandler(sparePartController_1.createSparePart));
router.get('/:id', asyncHandler(sparePartController_1.getOneSparePart));
router.put('/:id', asyncHandler(sparePartController_1.updateSparePart));
router.delete('/:id', asyncHandler(sparePartController_1.deleteSparePart));
exports.default = router;
