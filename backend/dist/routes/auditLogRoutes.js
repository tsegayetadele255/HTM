"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auditLogController_1 = require("../controllers/auditLogController");
const router = (0, express_1.Router)();
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
router.get('/', asyncHandler(auditLogController_1.getAllAuditLogs));
router.post('/', asyncHandler(auditLogController_1.createAuditLog));
router.get('/:id', asyncHandler(auditLogController_1.getOneAuditLog));
router.put('/:id', asyncHandler(auditLogController_1.updateAuditLog));
router.delete('/:id', asyncHandler(auditLogController_1.deleteAuditLog));
exports.default = router;
