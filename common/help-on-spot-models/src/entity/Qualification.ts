import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export default class Qualification extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  key: string | undefined;

  @Column()
  name: string | undefined;

}
