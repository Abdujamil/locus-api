import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException } from '@nestjs/common';
import { LocusService } from './locus.service';
import { RncLocus } from './entities/locus.entity';
import { SideloadingParam } from './dto/get-locus.dto';

describe('LocusService', () => {
  let service: LocusService;
  let mockQueryBuilder: Record<string, jest.Mock>;

  beforeEach(async () => {
    mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([{ id: 1 }]),
    };

    const mockRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocusService,
        {
          provide: getRepositoryToken(RncLocus),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<LocusService>(LocusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw ForbiddenException if normal user tries to use sideloading', async () => {
    await expect(
      service.getLoci(
        { sideloading: SideloadingParam.LocusMembers },
        { role: 'normal' },
      ),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should allow normal user without sideloading', async () => {
    const result = await service.getLoci({}, { role: 'normal' });
    expect(result).toEqual([{ id: 1 }]);
    expect(mockQueryBuilder.leftJoinAndSelect).not.toHaveBeenCalled();
  });

  it('should restrict regions for limited user', async () => {
    await service.getLoci({}, { role: 'limited' });
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'rlm.regionId IN (:...regionIds)',
      expect.objectContaining({
        regionIds: expect.arrayContaining([86118093, 86696489, 88186467]),
      }),
    );
  });

  it('should return empty array when limited user requests regionId outside allowed', async () => {
    const result = await service.getLoci(
      { regionId: [99999999] },
      { role: 'limited' },
    );
    expect(result).toEqual([]);
  });

  it('should apply id filter correctly', async () => {
    await service.getLoci({ id: [1, 2, 3] }, { role: 'admin' });
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'rl.id IN (:...id)',
      { id: [1, 2, 3] },
    );
  });

  it('should use leftJoinAndSelect when admin uses sideloading', async () => {
    await service.getLoci(
      { sideloading: SideloadingParam.LocusMembers },
      { role: 'admin' },
    );
    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
      'rl.locusMembers',
      'rlm',
    );
  });

  it('should apply correct pagination offset for page 2', async () => {
    await service.getLoci({ page: 2, limit: 50 }, { role: 'admin' });
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(50);
    expect(mockQueryBuilder.take).toHaveBeenCalledWith(50);
  });
});
