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
exports.Fussballspieler = void 0;
const typeorm_1 = require("typeorm");
const person_entity_1 = require("./person.entity");
let Fussballspieler = class Fussballspieler {
    constructor(data) {
        if (data) {
            this.fieldPosition = data.fieldPosition;
        }
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Fussballspieler.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Fussballspieler.prototype, "fieldPosition", void 0);
__decorate([
    typeorm_1.OneToOne(() => person_entity_1.Person, (person) => person.fussballspieler, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", person_entity_1.Person)
], Fussballspieler.prototype, "person", void 0);
Fussballspieler = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Fussballspieler])
], Fussballspieler);
exports.Fussballspieler = Fussballspieler;
//# sourceMappingURL=fussballspieler.entity.js.map