import { Qualification, User } from '/opt/nodejs/common/help-on-spot-models/dist'
import Request from '/opt/nodejs/common/help-on-spot-models/dist/entity/Request'
import { Database } from '/opt/nodejs/common/help-on-spot-models/dist/utils/Database'
import { LambdaResponse, lambdaResponse } from '/opt/nodejs/common/help-on-spot-models/dist/utils/lambdaResponse'

export interface LambdaInputEvent {
    pathParameters: {
        userId: string
        requestType?: string
        location?: { lat: number; long: number }
    }
    queryStringParameters?: {
        radius?: number
    }
}

// TODO: this should probably be done as part of the DB query.
function matchesUserQualifications(request: Request, userQualifications: Qualification[] | undefined): boolean {
    if (!request.qualifications || request.qualifications.length === 0) {
        return true
    }
    const userQualificationKeys = userQualifications!.map((qualification) => qualification.key)
    return request.qualifications!.every((request) => userQualificationKeys.includes(request.key))
}

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
    const db = new Database()
    const connection = await db.getConnection()
    const userId = event.pathParameters.userId
    const radius = event.queryStringParameters && event.queryStringParameters.radius

    try {
        console.log(`Trying to find suitable Requests for user ${userId}`)
        const user = await connection.getRepository(User).findOne({
            where: { id: userId },
            relations: ['qualifications', 'address']
        })
        if (!user) {
            return lambdaResponse(400, 'Given User does not exist')
        }

        const searchRadius = radius || user.travellingDistance
        if (!searchRadius) {
            return lambdaResponse(400, 'No search-radius provided and user has no travelling distance set!')
        }

        const userQualifications: Qualification[] = user.qualifications!
        const requestedCity = user.address!.city

        const requestRepository = connection.getRepository(Request)

        /**
         * raw query:
         SELECT *
         FROM request AS req
         INNER JOIN address AS add ON add.id = req."addressId"
         WHERE ST_Distance_Sphere(add.point, ST_MakePoint(52.5243741,13.4057372)) <= 1800;
         */
        const geoMatchedRequests = await requestRepository
            .createQueryBuilder('request')
            .innerJoinAndSelect('request.address', 'address')
            .innerJoinAndSelect('request.qualifications', 'qualifications')
            .where('ST_Distance(address.point, ST_SetSRID(ST_MakePoint(:userLng,:userLat),4326)) <= :userTravellingDistance', {
                userLng: user.address!.point!.coordinates[0],
                userLat: user.address!.point!.coordinates[1],
                userTravellingDistance: searchRadius
            })
            .getMany()

        console.log('Found ' + geoMatchedRequests.length + ' geo location matches')

        if (!geoMatchedRequests) {
            return lambdaResponse(404, 'No Requests match the given query')
        }

        const qualificationMatchedRequests = geoMatchedRequests.filter((request) =>
            matchesUserQualifications(request, userQualifications)
        )
        console.log('Found ' + qualificationMatchedRequests.length + ' location+qualification matches')

        return lambdaResponse(200, qualificationMatchedRequests)
    } catch (e) {
        console.log(`Error during lambda execution: ${e}`)
        return lambdaResponse(500, JSON.stringify(e))
    } finally {
        await db.disconnect(connection)
    }
}
