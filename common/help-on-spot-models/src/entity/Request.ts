import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    OneToOne,
    JoinColumn,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    JoinTable
} from 'typeorm'
import Organisation from './Organisation'
import Qualification from './Qualification'
import Address from './Address'
import RequestResponse from './RequestResponse'
import { RequestData } from '../models/RestModels'

@Entity()
export default class Request extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string

    @Column()
    title?: string

    @Column()
    description?: string

    @Column()
    isActive?: boolean

    @Column()
    startDate?: Date

    @Column()
    endDate?: Date

    @CreateDateColumn()
    createTime?: Date

    @UpdateDateColumn()
    updateTime?: Date

    @OneToOne((type) => Address, { cascade: true })
    @JoinColumn()
    address?: Address

    @ManyToMany((type) => Qualification, (qualification) => qualification.requests)
    @JoinTable({ name: 'join_request_qualification' })
    qualifications?: Qualification[]

    @ManyToOne((type) => Organisation, (organisation) => organisation.requests)
    organisation?: Organisation

    @OneToMany((type) => RequestResponse, (requestResponse) => requestResponse.request)
    requestResponses?: RequestResponse[]

    constructor(requestData: RequestData, organisation: Organisation, qualifiactions: Qualification[] | undefined) {
        super()
        if (requestData) {
            this.title = requestData.title
            this.description = requestData.description
            this.address = new Address(requestData.address)
            this.isActive = requestData.isActive ? requestData.isActive : true
            this.organisation = organisation
            this.startDate = new Date(Date.parse(requestData.startDate))
            this.endDate = new Date(Date.parse(requestData.endDate))
            this.qualifications = qualifiactions
        }
    }
}
