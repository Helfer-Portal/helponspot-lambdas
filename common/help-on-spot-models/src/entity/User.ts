import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  OneToMany, CreateDateColumn, UpdateDateColumn, JoinTable
} from "typeorm";
import Address from "./Address";
import Qualification from "./Qualification";
import Organisation from "./Organisation";
import RequestResponse from "./RequestResponse";

@Entity()
export default class User extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  isGPSLocationAllowed: boolean;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  travellingDistance: number;

  @CreateDateColumn()
  createTime?: Date;

  @UpdateDateColumn()
  updateTime?: Date;

  @OneToOne(type => Address, { cascade: true })
  @JoinColumn({name: 'join_user_address'})
  address?: Address;

  @ManyToMany(type => Qualification, qualification => qualification.users)
  @JoinTable({name: 'join_user_qualification'})
  qualifications?: Qualification[];

  @ManyToMany(type => Organisation, organisation => organisation.responsibles)
  @JoinTable({name: 'join_user_organisation'})
  organisations?: Organisation[];

  @OneToMany(type => RequestResponse, requestResponse => requestResponse.user)
  requestResponses?: RequestResponse[];

  constructor(firstName: string, lastName: string, isGPSLocationAllowed: boolean, email: string, avatar: string, travellingDistance: number, qualifications: Qualification[]) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.isGPSLocationAllowed = isGPSLocationAllowed;
    this.email = email;
    this.avatar = avatar;
    this.travellingDistance = travellingDistance;
    this.qualifications = qualifications;
  }
}
