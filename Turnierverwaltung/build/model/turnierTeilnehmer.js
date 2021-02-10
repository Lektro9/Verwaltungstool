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
exports.TurnierTeilnehmer = void 0;
const typeorm_1 = require("typeorm");
const turnier_1 = require("./turnier");
let TurnierTeilnehmer = class TurnierTeilnehmer {
    constructor(data) {
        if (data) {
            this.mannschaftID = data.mannschaftID;
            this.turnier = data.turnier;
        }
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], TurnierTeilnehmer.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], TurnierTeilnehmer.prototype, "mannschaftID", void 0);
__decorate([
    typeorm_1.ManyToOne(() => turnier_1.Turnier, turnier => turnier.teilnehmer, { onDelete: 'CASCADE' }),
    __metadata("design:type", turnier_1.Turnier)
], TurnierTeilnehmer.prototype, "turnier", void 0);
TurnierTeilnehmer = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [TurnierTeilnehmer])
], TurnierTeilnehmer);
exports.TurnierTeilnehmer = TurnierTeilnehmer;
//# sourceMappingURL=turnierTeilnehmer.js.map