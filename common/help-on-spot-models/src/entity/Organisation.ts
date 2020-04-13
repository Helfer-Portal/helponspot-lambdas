import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  OneToMany
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

  @Column()
  createTime?: Date;

  @OneToOne(type => Address)
  @JoinColumn()
  address?: Address;

  @ManyToMany(type => User, user => user.organisations)
  users?: User[];

  @OneToMany(type => Request, request => request.organisation)
  requests?: Request[];

}
