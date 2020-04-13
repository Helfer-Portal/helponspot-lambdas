import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import Organisation from "./Organisation";
import Qualification from "./Qualification";
import Address from "./Address";
import RequestResponse from "./RequestResponse";

@Entity()
export default class Request extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column()
  isActive: number | undefined;

  @Column()
  start: Date | undefined;

  @Column()
  end: Date | undefined;

  @Column()
  city: string | undefined;

  @Column()
  country: string | undefined;

  @Column()
  createTime: Date | undefined;

  @OneToOne(type => Address)
  @JoinColumn()
  address: Address | undefined;

  @ManyToMany(type => Qualification, qualification => qualification.requests)
  qualifications: Qualification[] | undefined;

  @ManyToOne(type => Organisation, organisation => organisation.requests)
  organisation: Organisation | undefined;

  @OneToMany(type => RequestResponse, requestResponse => requestResponse.request)
  requestResponses: RequestResponse[] | undefined;

}
