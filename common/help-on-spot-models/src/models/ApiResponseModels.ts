import User from '../entity/User'
import Organisation from '../entity/Organisation'
import Request from '../entity/Request'

export function convertEntityToResponseModel(entity: User | Organisation | Request): object {
    return {
        ...entity,
        address: {
            country: entity.address!.country,
            city: entity.address!.city,
            postalCode: entity.address!.postalCode,
            street: entity.address!.street,
            houseNumber: entity.address!.houseNumber,
            location: {
                longitude: entity.address!.point!.coordinates[0],
                latitude: entity.address!.point!.coordinates[1]
            }
        }
    }
}
