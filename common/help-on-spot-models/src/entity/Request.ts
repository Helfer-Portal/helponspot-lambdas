import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import Organisation from "./Organisation";
import Qualification from "./Qualification";
import Address from "./Address";
import RequestResponse from "./RequestResponse";

@Entity()
export default class Request extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  title?: string;

  @Column()
  description?: string;

  @Column()
  isActive?: number;

  @Column()
  startDate?: Date;

  @Column()
  endDate?: Date;

  @CreateDateColumn()
  createTime?: Date;

  @UpdateDateColumn()
  updateTime?: Date;

  @OneToOne(type => Address)
  @JoinColumn()
  address?: Address;

  @ManyToMany(type => Qualification, qualification => qualification.requests)
  qualifications?: Qualification[];

  @ManyToOne(type => Organisation, organisation => organisation.requests)
  organisation?: Organisation;

  @OneToMany(type => RequestResponse, requestResponse => requestResponse.request)
  requestResponses?: RequestResponse[];

}
