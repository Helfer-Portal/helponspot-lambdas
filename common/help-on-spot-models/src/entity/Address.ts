import {BaseEntity, Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export default class Address extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  street: string | undefined;

  @Column()
  houseNumber: string | undefined;

  @Column()
  postalCode: string | undefined;

  @Column()
  city: string | undefined;

  @Column()
  country: string | undefined;

}
