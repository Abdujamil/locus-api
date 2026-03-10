import { RncLocusMember } from './locus-member.entity';
export declare class RncLocus {
    id: number;
    assemblyId: string;
    locusName: string;
    publicLocusName: string;
    chromosome: string;
    strand: string;
    locusStart: number;
    locusStop: number;
    memberCount: number;
    locusMembers: RncLocusMember[];
}
