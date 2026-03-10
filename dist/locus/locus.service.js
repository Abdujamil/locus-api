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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocusService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const locus_entity_1 = require("./entities/locus.entity");
const get_locus_dto_1 = require("./dto/get-locus.dto");
let LocusService = class LocusService {
    locusRepo;
    constructor(locusRepo) {
        this.locusRepo = locusRepo;
    }
    async getLoci(dto, user) {
        const { id, assemblyId, regionId, membershipStatus, sideloading, page = 1, limit = 1000, sortBy, sortOrder, } = dto;
        const { role } = user;
        const query = this.locusRepo.createQueryBuilder('rl');
        if (role === 'normal' && sideloading === get_locus_dto_1.SideloadingParam.LocusMembers) {
            throw new common_1.ForbiddenException('Normal user cannot use sideloading');
        }
        let allowedRegionIds = null;
        if (role === 'limited') {
            allowedRegionIds = [86118093, 86696489, 88186467];
        }
        const needsMemberFilter = regionId !== undefined ||
            membershipStatus !== undefined ||
            role === 'limited';
        const isSideloading = sideloading === get_locus_dto_1.SideloadingParam.LocusMembers;
        if (isSideloading) {
            query.leftJoinAndSelect('rl.locusMembers', 'rlm');
        }
        else if (needsMemberFilter) {
            query.innerJoin('rl.locusMembers', 'rlm');
        }
        if (id && id.length > 0) {
            query.andWhere('rl.id IN (:...id)', { id });
        }
        if (assemblyId) {
            query.andWhere('rl.assemblyId = :assemblyId', { assemblyId });
        }
        if (needsMemberFilter || isSideloading) {
            let finalRegionIds = regionId;
            if (allowedRegionIds) {
                if (regionId && regionId.length > 0) {
                    finalRegionIds = regionId.filter((r) => allowedRegionIds.includes(r));
                    if (finalRegionIds.length === 0) {
                        return [];
                    }
                }
                else {
                    finalRegionIds = allowedRegionIds;
                }
            }
            if (finalRegionIds && finalRegionIds.length > 0) {
                query.andWhere('rlm.regionId IN (:...regionIds)', {
                    regionIds: finalRegionIds,
                });
            }
            if (membershipStatus) {
                query.andWhere('rlm.membershipStatus = :membershipStatus', {
                    membershipStatus,
                });
            }
        }
        query.skip((page - 1) * limit);
        query.take(limit);
        if (sortBy) {
            query.orderBy(`rl.${sortBy}`, sortOrder || 'ASC');
        }
        else {
            query.orderBy('rl.id', 'ASC');
        }
        const locusList = await query.getMany();
        return locusList.map((locus) => {
            let ursTaxid = undefined;
            const isSideloadingEnabled = sideloading === get_locus_dto_1.SideloadingParam.LocusMembers && role !== 'normal';
            if (locus.locusMembers && locus.locusMembers.length > 0) {
                ursTaxid = locus.locusMembers[0].ursTaxid;
            }
            const mapped = {
                ...locus,
                ursTaxid: ursTaxid || undefined,
            };
            if (!isSideloadingEnabled) {
                mapped.locusMembers = undefined;
            }
            return mapped;
        });
    }
};
exports.LocusService = LocusService;
exports.LocusService = LocusService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(locus_entity_1.RncLocus)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LocusService);
//# sourceMappingURL=locus.service.js.map