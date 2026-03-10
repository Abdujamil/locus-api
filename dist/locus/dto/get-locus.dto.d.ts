export declare enum SideloadingParam {
    LocusMembers = "locusMembers"
}
export declare enum SortOrder {
    ASC = "ASC",
    DESC = "DESC"
}
export declare class GetLocusDto {
    id?: number[];
    assemblyId?: string;
    regionId?: number[];
    membershipStatus?: string;
    sideloading?: SideloadingParam;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: SortOrder;
}
