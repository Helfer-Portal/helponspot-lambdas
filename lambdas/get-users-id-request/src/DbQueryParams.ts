import {User} from "/opt/nodejs/common/help-on-spot-models/dist";
import {LambdaInputEvent} from "./index";

export interface DbQueryParams {
    lng: number,
    lat: number,
    maxDistance: number
}

/**
* Use provided location if available, otherwise take location for user's address
 */
export function createQueryParams(user: User, event: LambdaInputEvent): DbQueryParams {
    const radius = event.queryStringParameters && event.queryStringParameters.radius
    const searchRadius = radius || user.travellingDistance
    if (event.queryStringParameters?.location) {
        return {
            lng: event.queryStringParameters?.location.long,
            lat: event.queryStringParameters?.location.lat,
            maxDistance: searchRadius
        }
    } else {
        return {
            lng: user.address!.point!.coordinates[0],
            lat: user.address!.point!.coordinates[1],
            maxDistance: searchRadius
        }
    }

}