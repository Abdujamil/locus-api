import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RncLocus } from './entities/locus.entity';
import { GetLocusDto, SideloadingParam } from './dto/get-locus.dto';

@Injectable()
export class LocusService {
  constructor(
    @InjectRepository(RncLocus)
    private locusRepo: Repository<RncLocus>,
  ) {}

  async getLoci(dto: GetLocusDto, user: any) {
    const {
      id,
      assemblyId,
      regionId,
      membershipStatus,
      sideloading,
      page = 1,
      limit = 1000,
      sortBy,
      sortOrder,
    } = dto;
    const { role } = user;

    const query = this.locusRepo.createQueryBuilder('rl');

    // Handle permissions
    if (role === 'normal' && sideloading === SideloadingParam.LocusMembers) {
      throw new ForbiddenException('Normal user cannot use sideloading');
    }

    let allowedRegionIds: number[] | null = null;
    if (role === 'limited') {
      allowedRegionIds = [86118093, 86696489, 88186467];
    }

    // Determine if we need to join members for filtering
    const needsMemberFilter =
      regionId !== undefined ||
      membershipStatus !== undefined ||
      role === 'limited';
    const isSideloading = sideloading === SideloadingParam.LocusMembers;

    if (isSideloading) {
      // If sideloading, we select the relation
      query.leftJoinAndSelect('rl.locusMembers', 'rlm');
    } else if (needsMemberFilter) {
      // If we only need it for filtering
      query.innerJoin('rl.locusMembers', 'rlm');
    }

    // Apply filters on rl
    if (id && id.length > 0) {
      query.andWhere('rl.id IN (:...id)', { id });
    }
    if (assemblyId) {
      query.andWhere('rl.assemblyId = :assemblyId', { assemblyId });
    }

    // Apply filters on rlm
    if (needsMemberFilter || isSideloading) {
      let finalRegionIds = regionId;
      if (allowedRegionIds) {
        if (regionId && regionId.length > 0) {
          // Intersect user requested regions with allowed regions
          finalRegionIds = regionId.filter((r) => allowedRegionIds.includes(r));
          if (finalRegionIds.length === 0) {
            // Requested regions are completely outside allowed
            return []; // or throw forbidden
          }
        } else {
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

    // Pagination
    query.skip((page - 1) * limit);
    query.take(limit);

    // Sorting
    if (sortBy) {
      // Assuming sortBy matches entity property, e.g., "id" -> "rl.id"
      query.orderBy(`rl.${sortBy}`, sortOrder || 'ASC');
    } else {
      query.orderBy('rl.id', 'ASC');
    }

    const locusList = await query.getMany();

    // Format output to camelCase (already handled by TypeORM returning entity instances, which are camelCase per our definition)
    return locusList.map((locus) => {
      // If we have locusMembers and there is at least one, extract first ursTaxid and attach it to root.
      // (as shown in the API output example)
      let ursTaxid: string | undefined = undefined;
      const isSideloadingEnabled =
        sideloading === SideloadingParam.LocusMembers && role !== 'normal';

      // If locusMembers array exists on the object, we can extract from it.
      // Note: for innerJoin searches without sideloading, locusMembers might not be populated or we strip it.
      if (locus.locusMembers && locus.locusMembers.length > 0) {
        ursTaxid = locus.locusMembers[0].ursTaxid;
      }

      // Build the final object
      const mapped = {
        ...locus,
        ursTaxid: ursTaxid || undefined, // add to root if it exists
      };

      // Remove locusMembers if not explicitly requested via sideloading
      if (!isSideloadingEnabled) {
        (mapped as any).locusMembers = undefined;
      }

      return mapped;
    });
  }
}
