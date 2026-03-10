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
exports.GetLocusDto = exports.SortOrder = exports.SideloadingParam = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var SideloadingParam;
(function (SideloadingParam) {
    SideloadingParam["LocusMembers"] = "locusMembers";
})(SideloadingParam || (exports.SideloadingParam = SideloadingParam = {}));
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "ASC";
    SortOrder["DESC"] = "DESC";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
class GetLocusDto {
    id;
    assemblyId;
    regionId;
    membershipStatus;
    sideloading;
    page = 1;
    limit = 1000;
    sortBy;
    sortOrder = SortOrder.ASC;
}
exports.GetLocusDto = GetLocusDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Comma separated list of ids' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (Array.isArray(value)) {
            return value.map((v) => parseInt(v, 10));
        }
        return value.split(',').map((v) => parseInt(v, 10));
    }),
    __metadata("design:type", Array)
], GetLocusDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'assemblyId single value' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetLocusDto.prototype, "assemblyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Comma separated list of regionIds' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (Array.isArray(value)) {
            return value.map((v) => parseInt(v, 10));
        }
        return value.split(',').map((v) => parseInt(v, 10));
    }),
    __metadata("design:type", Array)
], GetLocusDto.prototype, "regionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'membershipStatus single value' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetLocusDto.prototype, "membershipStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: SideloadingParam,
        description: 'Sideloading parameters',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SideloadingParam),
    __metadata("design:type", String)
], GetLocusDto.prototype, "sideloading", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], GetLocusDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], GetLocusDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Field to sort by', example: 'id' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetLocusDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: SortOrder, default: SortOrder.ASC }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SortOrder),
    __metadata("design:type", String)
], GetLocusDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=get-locus.dto.js.map