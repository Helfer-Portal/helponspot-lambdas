import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import User from './User'
import Request from './Request'

@Entity()
export default class Qualification extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string

    @Column()
    key?: string

    @Column()
    name?: string

    @ManyToMany((type) => User, (user) => user.qualifications)
    users?: User[]

    @Column({nullable: true})
    category?: string

    @ManyToMany((type) => Request, (request) => request.qualifications)
    requests?: Request[]
}
