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
exports.Physiotherapeut = void 0;
const typeorm_1 = require("typeorm");
const person_entity_1 = require("./person.entity");
let Physiotherapeut = class Physiotherapeut {
    constructor(data) {
        if (data) {
            this.treatmentType = data.treatmentType;
        }
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Physiotherapeut.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Physiotherapeut.prototype, "treatmentType", void 0);
__decorate([
    typeorm_1.OneToOne(() => person_entity_1.Person, person => person.physiotherapeut, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", person_entity_1.Person)
], Physiotherapeut.prototype, "person", void 0);
Physiotherapeut = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Physiotherapeut])
], Physiotherapeut);
exports.Physiotherapeut = Physiotherapeut;
//# sourceMappingURL=physiotherapeut.entity.js.map