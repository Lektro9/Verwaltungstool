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
exports.Spiel = void 0;
const typeorm_1 = require("typeorm");
const turnier_1 = require("./turnier");
let Spiel = class Spiel {
    constructor(data) {
        if (data) {
            this.team1Id = data.team1Id;
            this.team2Id = data.team2Id;
            this.team1Punkte = data.team1Punkte;
            this.team2Punkte = data.team2Punkte;
        }
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Spiel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Spiel.prototype, "team1Id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Spiel.prototype, "team2Id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Spiel.prototype, "team1Punkte", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Spiel.prototype, "team2Punkte", void 0);
__decorate([
    typeorm_1.ManyToOne(() => turnier_1.Turnier, turnier => turnier.games, { onDelete: 'CASCADE' }),
    __metadata("design:type", turnier_1.Turnier)
], Spiel.prototype, "turnier", void 0);
Spiel = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Spiel])
], Spiel);
exports.Spiel = Spiel;
//# sourceMappingURL=spiel.js.map