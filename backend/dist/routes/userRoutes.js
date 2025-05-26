"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.get('/', userController_1.getAllUsers);
router.post('/', userController_1.createUser);
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
router.delete('/:id', asyncHandler(userController_1.deleteUser));
router.put('/:id', asyncHandler(userController_1.updateUser));
exports.default = router;
