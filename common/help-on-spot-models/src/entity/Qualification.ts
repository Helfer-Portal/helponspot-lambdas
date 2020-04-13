import {BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import User from "./User";
import Request from "./Request";

@Entity()
export default class Qualification extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column()
  key: string | undefined;

  @Column()
  name: string | undefined;

  @ManyToMany(type => User, user => user.qualifications)
  users: User[] | undefined;

  @ManyToMany(type => Request, request => request.qualifications)
  requests: Request[] | undefined;

}
