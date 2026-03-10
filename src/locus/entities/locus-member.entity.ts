import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RncLocus } from './locus.entity';

@Entity('rnc_locus_members')
export class RncLocusMember {
  @PrimaryColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'urs_taxid', type: 'varchar' })
  ursTaxid: string;

  @Column({ name: 'region_id', type: 'int' })
  regionId: number;

  @Column({ name: 'locus_id', type: 'int' })
  locusId: number;

  @Column({ name: 'membership_status', type: 'varchar' })
  membershipStatus: string;

  @ManyToOne(() => RncLocus, (locus) => locus.locusMembers)
  @JoinColumn({ name: 'locus_id' })
  locus: RncLocus;
}
