"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sopController_1 = require("../controllers/sopController");
const router = (0, express_1.Router)();
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
router.get('/', asyncHandler(sopController_1.getAllSOPs));
router.post('/', asyncHandler(sopController_1.createSOP));
router.get('/:id', asyncHandler(sopController_1.getOneSOP));
router.put('/:id', asyncHandler(sopController_1.updateSOP));
router.delete('/:id', asyncHandler(sopController_1.deleteSOP));
exports.default = router;
