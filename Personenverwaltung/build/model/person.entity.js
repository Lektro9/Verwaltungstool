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
exports.Person = void 0;
const typeorm_1 = require("typeorm");
const fussballspieler_entity_1 = require("./fussballspieler.entity");
const handballspieler_entity_1 = require("./handballspieler.entity");
const tennisspieler_entity_1 = require("./tennisspieler.entity");
const trainer_entity_1 = require("./trainer.entity");
const physiotherapeut_entity_1 = require("./physiotherapeut.entity");
let Person = class Person {
    constructor(data) {
        if (data) {
            this.type = data.type;
            this.firstName = data.firstName;
            this.lastName = data.lastName;
            this.birthday = data.birthday;
        }
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Person.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Person.prototype, "type", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Person.prototype, "firstName", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Person.prototype, "lastName", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Person.prototype, "birthday", void 0);
__decorate([
    typeorm_1.OneToOne(() => fussballspieler_entity_1.Fussballspieler, fussballspieler => fussballspieler.person, { eager: true }),
    __metadata("design:type", fussballspieler_entity_1.Fussballspieler)
], Person.prototype, "fussballspieler", void 0);
__decorate([
    typeorm_1.OneToOne(() => handballspieler_entity_1.Handballspieler, handballspieler => handballspieler.person, { eager: true }),
    __metadata("design:type", handballspieler_entity_1.Handballspieler)
], Person.prototype, "handballspieler", void 0);
__decorate([
    typeorm_1.OneToOne(() => tennisspieler_entity_1.Tennisspieler, tennisspieler => tennisspieler.person, { eager: true }),
    __metadata("design:type", tennisspieler_entity_1.Tennisspieler)
], Person.prototype, "tennisspieler", void 0);
__decorate([
    typeorm_1.OneToOne(() => trainer_entity_1.Trainer, trainer => trainer.person, { eager: true }),
    __metadata("design:type", trainer_entity_1.Trainer)
], Person.prototype, "trainer", void 0);
__decorate([
    typeorm_1.OneToOne(() => physiotherapeut_entity_1.Physiotherapeut, physiotherapeut => physiotherapeut.person, { eager: true }),
    __metadata("design:type", physiotherapeut_entity_1.Physiotherapeut)
], Person.prototype, "physiotherapeut", void 0);
Person = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Person])
], Person);
exports.Person = Person;
//# sourceMappingURL=person.entity.js.map