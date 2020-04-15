import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable
} from "typeorm";
import Address from "./Address";
import User from "./User";
import Request from "./Request";

@Entity()
export default class Organisation extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  name?: string;

  @Column({nullable: true})
  teaser?: string;

  @Column()
  logoPath?: string;

  @Column({nullable: true})
  email?: string;

  @CreateDateColumn()
  createTime?: Date;

  @UpdateDateColumn()
  updateTime?: Date;

  @OneToOne(type => Address, {cascade: true})
  @JoinColumn()
  address?: Address;

  @ManyToMany(type => User, user => user.organisations)
  responsibles?: User[];

  @OneToMany(type => Request, request => request.organisation)
  requests?: Request[];

}
