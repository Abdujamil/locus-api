import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsOptional, IsInt, IsString, IsIn, IsEnum } from 'class-validator';

export enum SideloadingParam {
  LocusMembers = 'locusMembers',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetLocusDto {
  @ApiPropertyOptional({ description: 'Comma separated list of ids' })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((v: string) => parseInt(v, 10));
    }
    return value.split(',').map((v: string) => parseInt(v, 10));
  })
  id?: number[];

  @ApiPropertyOptional({ description: 'assemblyId single value' })
  @IsOptional()
  @IsString()
  assemblyId?: string;

  @ApiPropertyOptional({ description: 'Comma separated list of regionIds' })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((v: string) => parseInt(v, 10));
    }
    return value.split(',').map((v: string) => parseInt(v, 10));
  })
  regionId?: number[];

  @ApiPropertyOptional({ description: 'membershipStatus single value' })
  @IsOptional()
  @IsString()
  membershipStatus?: string;

  @ApiPropertyOptional({
    enum: SideloadingParam,
    description: 'Sideloading parameters',
  })
  @IsOptional()
  @IsEnum(SideloadingParam)
  sideloading?: SideloadingParam;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({ default: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 1000;

  @ApiPropertyOptional({ description: 'Field to sort by', example: 'id' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.ASC })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.ASC;
}
