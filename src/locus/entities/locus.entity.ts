import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { RncLocusMember } from './locus-member.entity';

@Entity('rnc_locus')
export class RncLocus {
  @PrimaryColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'assembly_id', type: 'varchar' })
  assemblyId: string;

  @Column({ name: 'locus_name', type: 'varchar' })
  locusName: string;

  @Column({ name: 'public_locus_name', type: 'varchar' })
  publicLocusName: string;

  @Column({ name: 'chromosome', type: 'varchar' })
  chromosome: string;

  @Column({ name: 'strand', type: 'varchar' })
  strand: string;

  @Column({ name: 'locus_start', type: 'int' })
  locusStart: number;

  @Column({ name: 'locus_stop', type: 'int' })
  locusStop: number;

  @Column({ name: 'member_count', type: 'int' })
  memberCount: number;

  @OneToMany(() => RncLocusMember, (locusMember) => locusMember.locus)
  locusMembers: RncLocusMember[];
}
