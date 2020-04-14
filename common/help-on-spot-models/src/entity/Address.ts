import {BaseEntity, Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export default class Address extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  street?: string;

  @Column()
  houseNumber?: string;

  @Column()
  postalCode?: string;

  @Column()
  city?: string;

  @Column()
  country?: string;

}
