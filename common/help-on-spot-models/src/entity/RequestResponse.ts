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

export enum ResponseRequestStatus {
  Pending = "pending",
  Accepted = "accepted",
  Declined = "declined"
}

@Entity()
export default class RequestResponse extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({enum: ResponseRequestStatus})
  status?: ResponseRequestStatus;

  @CreateDateColumn()
  createTime?: Date;

  @UpdateDateColumn()
  updateTime?: Date;

  @ManyToOne(type => User)
  user?: User;
  @Column()
  userId?: string;

  @ManyToOne(type => Request)
  request?: Request;
  @Column()
  requestId?: string;

}
