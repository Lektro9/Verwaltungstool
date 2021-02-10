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
exports.MannschaftMitglied = void 0;
const typeorm_1 = require("typeorm");
const mannschaft_1 = require("./mannschaft");
let MannschaftMitglied = class MannschaftMitglied {
    constructor(data) {
        if (data) {
            this.personenId = data.personenId;
            this.mannschaft = data.mannschaft;
        }
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], MannschaftMitglied.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MannschaftMitglied.prototype, "personenId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => mannschaft_1.Mannschaft, (mannschaft) => mannschaft.mitglieder, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", mannschaft_1.Mannschaft)
], MannschaftMitglied.prototype, "mannschaft", void 0);
MannschaftMitglied = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [MannschaftMitglied])
], MannschaftMitglied);
exports.MannschaftMitglied = MannschaftMitglied;
//# sourceMappingURL=mannschaftMitglieder.js.map