import {BaseEntity, Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export default class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  isGPSLocationAllowed: boolean;

  @Column()
  avatar: string;

  constructor(firstName: string, lastName: string, isGPSLocationAllowed: boolean, avatar: string) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.isGPSLocationAllowed = isGPSLocationAllowed;
    this.avatar = avatar;
  }

}
