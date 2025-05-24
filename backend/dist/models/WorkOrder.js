"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkOrder = void 0;
const typeorm_1 = require("typeorm");
const Equipment_1 = require("./Equipment");
const User_1 = require("./User");
let WorkOrder = class WorkOrder {
};
exports.WorkOrder = WorkOrder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], WorkOrder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WorkOrder.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WorkOrder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WorkOrder.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.assignedWorkOrders, { nullable: true }),
    __metadata("design:type", User_1.User)
], WorkOrder.prototype, "assignedTechnician", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], WorkOrder.prototype, "repairCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WorkOrder.prototype, "repairTime", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Equipment_1.Equipment, equipment => equipment.workOrders),
    __metadata("design:type", Equipment_1.Equipment)
], WorkOrder.prototype, "equipment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.reportedWorkOrders, { nullable: true }),
    __metadata("design:type", User_1.User)
], WorkOrder.prototype, "faultReportedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WorkOrder.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], WorkOrder.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], WorkOrder.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WorkOrder.prototype, "maintenanceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WorkOrder.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WorkOrder.prototype, "solution", void 0);
exports.WorkOrder = WorkOrder = __decorate([
    (0, typeorm_1.Entity)()
], WorkOrder);
