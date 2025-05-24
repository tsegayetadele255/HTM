"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const incidentController_1 = require("../controllers/incidentController");
const router = (0, express_1.Router)();
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
router.get('/', asyncHandler(incidentController_1.getAllIncidents));
router.post('/', asyncHandler(incidentController_1.createIncident));
router.get('/:id', asyncHandler(incidentController_1.getOneIncident));
router.put('/:id', asyncHandler(incidentController_1.updateIncident));
router.delete('/:id', asyncHandler(incidentController_1.deleteIncident));
exports.default = router;
