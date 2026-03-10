import { Repository } from 'typeorm';
import { RncLocus } from './entities/locus.entity';
import { GetLocusDto } from './dto/get-locus.dto';
export declare class LocusService {
    private locusRepo;
    constructor(locusRepo: Repository<RncLocus>);
    getLoci(dto: GetLocusDto, user: any): Promise<{
        ursTaxid: string | undefined;
        id: number;
        assemblyId: string;
        locusName: string;
        publicLocusName: string;
        chromosome: string;
        strand: string;
        locusStart: number;
        locusStop: number;
        memberCount: number;
        locusMembers: import("./entities/locus-member.entity").RncLocusMember[];
    }[]>;
}
