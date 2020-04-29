import { Qualification, User } from '../../../common/help-on-spot-models/dist'
import Request from '../../../common/help-on-spot-models/dist/entity/Request'
import { Database } from '../../../common/help-on-spot-models/dist/utils/Database'
import { LambdaResponse, lambdaResponse } from '../../../common/help-on-spot-models/dist/utils/lambdaResponse'

export interface LambdaInputEvent {
    pathParameters: {
        userId: string
        radius?: string
        requestType?: string
        location?: { lat: number; long: number }
    }
}

/*
 * TODO: this should probably be done as part of the DB query. But since this will change anyway once we change to
 * actual locations I guess it is good enough atm.
 */
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
    const radius = event.pathParameters.radius

    try {
        console.log(`Trying to find suitable Requests for user ${userId}`)
        const user = await connection.getRepository(User).findOne({
            where: { id: userId },
            relations: ['qualifications', 'address']
        })
        if (!user) {
            return lambdaResponse(400, 'Given User does not exist')
        }

        const searchRadius = radius || user.travellingDistance;
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
         * Docs:
         * https://github.com/typeorm/typeorm/blob/master/docs/entities.md#spatial-columns
         */
        const geoMatchedRequests = await requestRepository
          .createQueryBuilder("request")
          .innerJoin('request.address', 'address')
          .where(
            'ST_Distance_Sphere(address.point, ST_MakePoint(:userLng,:userLat)) <= :userTravellingDistance',
            {
                userLng: user.address!.point!.coordinates[0],
                userLat: user.address!.point!.coordinates[1],
                userTravellingDistance: user.travellingDistance
            }
          )
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
