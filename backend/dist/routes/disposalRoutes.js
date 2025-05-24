"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const disposalController_1 = require("../controllers/disposalController");
const router = (0, express_1.Router)();
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
router.get('/', asyncHandler(disposalController_1.getAllDisposalRecords));
router.post('/', asyncHandler(disposalController_1.createDisposalRecord));
router.get('/:id', asyncHandler(disposalController_1.getOneDisposalRecord));
router.put('/:id', asyncHandler(disposalController_1.updateDisposalRecord));
router.delete('/:id', asyncHandler(disposalController_1.deleteDisposalRecord));
exports.default = router;
