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
exports.CalibrationRecord = void 0;
const typeorm_1 = require("typeorm");
const Equipment_1 = require("./Equipment");
const User_1 = require("./User");
let CalibrationRecord = class CalibrationRecord {
};
exports.CalibrationRecord = CalibrationRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CalibrationRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Equipment_1.Equipment, { nullable: false }),
    __metadata("design:type", Equipment_1.Equipment)
], CalibrationRecord.prototype, "equipment", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], CalibrationRecord.prototype, "calibrationDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], CalibrationRecord.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { nullable: false }),
    __metadata("design:type", User_1.User)
], CalibrationRecord.prototype, "performedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CalibrationRecord.prototype, "certificateUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], CalibrationRecord.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CalibrationRecord.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CalibrationRecord.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CalibrationRecord.prototype, "updatedAt", void 0);
exports.CalibrationRecord = CalibrationRecord = __decorate([
    (0, typeorm_1.Entity)()
], CalibrationRecord);
