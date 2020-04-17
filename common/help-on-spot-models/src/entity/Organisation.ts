import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    ManyToMany,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    JoinTable
} from "typeorm";
import Address from "./Address";
import User from "./User";
import Request from "./Request";
import {AddressData, OrganisationData} from "../models/RestModels";

@Entity()
export default class Organisation extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column()
    name?: string;

    @Column({nullable: true})
    teaser?: string;

    @Column({nullable:true})
    logoPath?: string;

    @Column({nullable: true})
    email?: string;

    @CreateDateColumn()
    createTime?: Date;

    @UpdateDateColumn()
    updateTime?: Date;

    @OneToOne(type => Address, {cascade: true})
    @JoinColumn()
    address?: Address;

    @ManyToMany(type => User, user => user.organisations)
    responsibles?: User[];

    @OneToMany(type => Request, request => request.organisation)
    requests?: Request[];


    constructor(organisationData: OrganisationData, responsibles: User[]) {
        super();
        if (organisationData) {
            this.name = organisationData.name
            this.email = organisationData.email
            this.responsibles = responsibles
            this.logoPath = organisationData.logoPath
            console.log('>>>>>' + JSON.stringify(responsibles))
            this.address = new Address(organisationData.address.street, organisationData.address.houseNumber, organisationData.address.postalCode, organisationData.address.city, organisationData.address.country)
        }
    }


}
