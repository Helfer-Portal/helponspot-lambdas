import {BaseEntity, Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export default class Address extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  street: string;

  @Column()
  houseNumber: string;

  @Column()
  postalCode: string;

  @Column()
  city: string;

  @Column()
  country: string;

  constructor(street: string, houseNumber: string, postalCode: string, city: string, country: string) {
      super();
      this.street = street
      this.houseNumber = houseNumber
      this.postalCode = postalCode
      this.city = city
      this.country = country
  }

}
