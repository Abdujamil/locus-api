import { RncLocus } from './locus.entity';
export declare class RncLocusMember {
    id: number;
    ursTaxid: string;
    regionId: number;
    locusId: number;
    membershipStatus: string;
    locus: RncLocus;
}
