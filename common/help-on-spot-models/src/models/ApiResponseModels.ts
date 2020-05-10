import User from '../entity/User'
import Organisation from '../entity/Organisation'
import Request from '../entity/Request'

export function convertEntityToResponseModel(entity: User | Organisation | Request): object {
    if (!entity.address) {
        return entity;
    }
    return {
        ...entity,
        address: {
            ...entity.address,
            location: entity.address.point ? {
                longitude: entity.address.point.coordinates[0],
                latitude: entity.address.point.coordinates[1]
            } : {}
        }
    }
}
