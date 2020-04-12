import {BaseEntity, Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export default class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  isGPSLocationAllowed: boolean;

  @Column()
  avatar: string;

  constructor(firstName, lastName, isGPSLocationAllowed, avatar) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.isGPSLocationAllowed = isGPSLocationAllowed;
    this.avatar = avatar;
  }

}
