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
exports.Mannschaft = void 0;
const typeorm_1 = require("typeorm");
const mannschaftMitglieder_1 = require("./mannschaftMitglieder");
let Mannschaft = class Mannschaft {
    constructor(data) {
        if (data) {
            this.name = data.name;
            this.sportType = data.sportType;
        }
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Mannschaft.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Mannschaft.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Mannschaft.prototype, "sportType", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Mannschaft.prototype, "gamesWon", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Mannschaft.prototype, "gamesLost", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Mannschaft.prototype, "draws", void 0);
__decorate([
    typeorm_1.OneToMany(() => mannschaftMitglieder_1.MannschaftMitglied, (mannschaftMitglied) => mannschaftMitglied.mannschaft),
    __metadata("design:type", Array)
], Mannschaft.prototype, "mitglieder", void 0);
Mannschaft = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Mannschaft])
], Mannschaft);
exports.Mannschaft = Mannschaft;
//# sourceMappingURL=mannschaft.js.map