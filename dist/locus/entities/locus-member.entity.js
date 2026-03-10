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
exports.RncLocusMember = void 0;
const typeorm_1 = require("typeorm");
const locus_entity_1 = require("./locus.entity");
let RncLocusMember = class RncLocusMember {
    id;
    ursTaxid;
    regionId;
    locusId;
    membershipStatus;
    locus;
};
exports.RncLocusMember = RncLocusMember;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'id', type: 'int' }),
    __metadata("design:type", Number)
], RncLocusMember.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'urs_taxid', type: 'varchar' }),
    __metadata("design:type", String)
], RncLocusMember.prototype, "ursTaxid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'region_id', type: 'int' }),
    __metadata("design:type", Number)
], RncLocusMember.prototype, "regionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'locus_id', type: 'int' }),
    __metadata("design:type", Number)
], RncLocusMember.prototype, "locusId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'membership_status', type: 'varchar' }),
    __metadata("design:type", String)
], RncLocusMember.prototype, "membershipStatus", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => locus_entity_1.RncLocus, (locus) => locus.locusMembers),
    (0, typeorm_1.JoinColumn)({ name: 'locus_id' }),
    __metadata("design:type", locus_entity_1.RncLocus)
], RncLocusMember.prototype, "locus", void 0);
exports.RncLocusMember = RncLocusMember = __decorate([
    (0, typeorm_1.Entity)('rnc_locus_members')
], RncLocusMember);
//# sourceMappingURL=locus-member.entity.js.map