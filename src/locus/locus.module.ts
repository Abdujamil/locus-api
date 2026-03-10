import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocusController } from './locus.controller';
import { LocusService } from './locus.service';
import { RncLocus } from './entities/locus.entity';
import { RncLocusMember } from './entities/locus-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RncLocus, RncLocusMember])],
  controllers: [LocusController],
  providers: [LocusService],
})
export class LocusModule {}
