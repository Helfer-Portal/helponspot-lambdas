import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import User from "./User";
import Request from "./Request";

enum Status {
  Pending,
  Accepted,
  Declined
}

@Entity()
export default class RequestResponse extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  status?: Status;

  @CreateDateColumn()
  createTime?: Date;

  @UpdateDateColumn()
  updateTime?: Date;

  @ManyToOne(type => User)
  user?: User;

  @ManyToOne(type => Request)
  request?: Request;

}
