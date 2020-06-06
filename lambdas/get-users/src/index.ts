import {User} from '/opt/nodejs/common/help-on-spot-models/dist'
import {Database} from '/opt/nodejs/common/help-on-spot-models/dist/utils/Database'
import {LambdaResponse, lambdaResponse} from '/opt/nodejs/common/help-on-spot-models/dist/utils/lambdaResponse'

export interface LambdaInputEvent {
    queryStringParameters: {
        location: number[],
        qualifications?: string[],
        maxDistanceInMeter?: number
    }
}


export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
    const db = new Database()
    const connection = await db.getConnection()
    const maxDistance = event.queryStringParameters.maxDistanceInMeter ? event.queryStringParameters.maxDistanceInMeter : 5000
    const qualifications = event.queryStringParameters.qualifications ? event.queryStringParameters.qualifications : []
    const location = event.queryStringParameters.location

    try {
        console.log(`Trying to find suitable Users for request with qualifications '${qualifications}', radius '${maxDistance}'`)
        const userRepository = connection.getRepository(User)

        const locationMatchedUsers = await userRepository
            .createQueryBuilder('user')
            .innerJoinAndSelect('user.address', 'address')
            .innerJoinAndSelect('user.qualifications', 'qualifications')
            .where('ST_Distance(address.point, ST_SetSRID(ST_MakePoint(:locationLong,:locationLat),4326)) <= :maxDistance', {
                locationLong: location[0],
                locationLat: location[1],
                maxDistance: maxDistance
            })
            .getMany()

        console.log(`Found '${locationMatchedUsers.length}' location matched users`)
        const qualifictaionMatchedUsers = matchesUserQualifications(locationMatchedUsers, qualifications)
        console.log(`Found '${qualifictaionMatchedUsers.length}' qualification matced users`)
        return lambdaResponse(200, locationMatchedUsers)
    } catch (e) {
        console.log(`Error during lambda execution: ${e}`)
        return lambdaResponse(500, JSON.stringify(e))
    } finally {
        await db.disconnect(connection)
    }
}


function matchesUserQualifications(users: User[], requestedQualifications: string[]): User[] {
    if (requestedQualifications.length === 0) {
        return users
    }
    return users.filter(user => {matches(user, requestedQualifications)})
}

function matches(user: User, qualifications: string[]): boolean {
    const userQualificationKeys = user.qualifications!.map((qualification) => qualification.key)
    return qualifications.every((q) => userQualificationKeys.includes(q))

}


