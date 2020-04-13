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
  id: string | undefined;

  @Column()
  name: string | undefined;

  @Column()
  teaser: string | undefined;

  @Column()
  avatar: string | undefined;

  @Column()
  email: string | undefined;

  @Column()
  createTime: Date | undefined;

  @OneToOne(type => Address)
  @JoinColumn()
  address: Address | undefined;

  @ManyToMany(type => User, user => user.organisations)
  users: User[] | undefined;

  @OneToMany(type => Request, request => request.organisation)
  requests: Request[] | undefined;

}
