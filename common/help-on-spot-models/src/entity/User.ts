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
import Qualification from "./Qualification";
import Organisation from "./Organisation";
import RequestResponse from "./RequestResponse";

@Entity()
export default class User extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  isGPSLocationAllowed: boolean;

  @Column()
  email: string;

  @Column()
  avatar: string;

  @Column()
  createTime: Date | undefined;

  @OneToOne(type => Address)
  @JoinColumn()
  address: Address | undefined;

  @ManyToMany(type => Qualification, qualification => qualification.users)
  qualifications: Qualification[] | undefined;

  @ManyToMany(type => Organisation, organisation => organisation.users)
  organisations: Organisation[] | undefined;

  @OneToMany(type => RequestResponse, requestResponse => requestResponse.user)
  requestResponses: RequestResponse[] | undefined;

  constructor(firstName: string, lastName: string, isGPSLocationAllowed: boolean, email: string, avatar: string) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.isGPSLocationAllowed = isGPSLocationAllowed;
    this.email = email;
    this.avatar = avatar;
  }

}
