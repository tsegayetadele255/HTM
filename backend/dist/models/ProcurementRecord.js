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
exports.ProcurementRecord = void 0;
const typeorm_1 = require("typeorm");
const Equipment_1 = require("./Equipment");
const User_1 = require("./User");
let ProcurementRecord = class ProcurementRecord {
};
exports.ProcurementRecord = ProcurementRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProcurementRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProcurementRecord.prototype, "item", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], ProcurementRecord.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProcurementRecord.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProcurementRecord.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProcurementRecord.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ProcurementRecord.prototype, "expectedDeliveryDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Equipment_1.Equipment, { nullable: true }),
    __metadata("design:type", Equipment_1.Equipment)
], ProcurementRecord.prototype, "equipment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { nullable: false }),
    __metadata("design:type", User_1.User)
], ProcurementRecord.prototype, "requestedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], ProcurementRecord.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProcurementRecord.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ProcurementRecord.prototype, "updatedAt", void 0);
exports.ProcurementRecord = ProcurementRecord = __decorate([
    (0, typeorm_1.Entity)()
], ProcurementRecord);
