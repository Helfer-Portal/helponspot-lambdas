import {BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
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
  id: string | undefined;

  @Column()
  status: Status | undefined;

  @Column()
  createTime: Date | undefined;

  @ManyToOne(type => User, )
  user: User | undefined;

  @ManyToOne(type => Request, )
  request: Request | undefined;

}
