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
exports.Turnier = void 0;
const typeorm_1 = require("typeorm");
const spiel_1 = require("./spiel");
const turnierTeilnehmer_1 = require("./turnierTeilnehmer");
let Turnier = class Turnier {
    constructor(data) {
        if (data) {
            this.name = data.name;
        }
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Turnier.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Turnier.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(() => turnierTeilnehmer_1.TurnierTeilnehmer, turnierTeilnehmer => turnierTeilnehmer.turnier),
    __metadata("design:type", Array)
], Turnier.prototype, "teilnehmer", void 0);
__decorate([
    typeorm_1.OneToMany(() => spiel_1.Spiel, spiel => spiel.turnier),
    __metadata("design:type", Array)
], Turnier.prototype, "games", void 0);
Turnier = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Turnier])
], Turnier);
exports.Turnier = Turnier;
//# sourceMappingURL=turnier.js.map