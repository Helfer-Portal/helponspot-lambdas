import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { AddressData } from '../models/RestModels'

@Entity()
export default class Address extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string

    @Column()
    street?: string

    @Column()
    houseNumber?: string

    @Column()
    postalCode?: string

    @Column()
    city?: string

    @Column()
    country?: string

    /**
     * Important: the first ([0]) element of the coordinates array represents the longitude value,
     * the second ([1]) element represents the latitude value
     */
    @Column('geometry', {
        nullable: true,
        spatialFeatureType: 'Point',
        srid: 4326
    })
    point?: {
        type: string
        coordinates: number[]
    }

    constructor(addressData: AddressData) {
        super()
        if (addressData) {
            this.street = addressData.street
            this.houseNumber = addressData.houseNumber
            this.postalCode = addressData.postalCode
            this.city = addressData.city
            this.country = addressData.country
            this.point = addressData.coordinates
                ? {
                      type: 'point',
                      coordinates: addressData.coordinates
                  }
                : undefined
        }
    }
}
