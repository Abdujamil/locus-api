import { LocusService } from './locus.service';
import { GetLocusDto } from './dto/get-locus.dto';
export declare class LocusController {
    private readonly locusService;
    constructor(locusService: LocusService);
    getLoci(query: GetLocusDto, req: any): Promise<{
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
