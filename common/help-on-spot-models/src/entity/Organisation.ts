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
  UpdateDateColumn
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

  @Column()
  teaser?: string;

  @Column()
  avatar?: string;

  @Column()
  email?: string;

  @CreateDateColumn()
  createTime?: Date;

  @UpdateDateColumn()
  updateTime?: Date;

  @OneToOne(type => Address)
  @JoinColumn()
  address?: Address;

  @ManyToMany(type => User, user => user.organisations)
  responsibles?: User[];

  @OneToMany(type => Request, request => request.organisation)
  requests?: Request[];

}
