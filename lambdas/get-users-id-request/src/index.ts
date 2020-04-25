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

/* TODO: this should probably be done as part of the DB query. But since this will change anyway once we change to
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

    try {
        console.log(`Trying to find suitable Requests for user ${userId}`)
        const user = await connection.getRepository(User).findOne({
            where: { id: userId },
            relations: ['qualifications', 'address']
        })
        if (!user) {
            return lambdaResponse(400, 'Given User does not exist')
        }

        const userQualifications: Qualification[] = user.qualifications!
        const requestedCity = user.address!.city

        const requestRepository = connection.getRepository(Request)
        const locationMatchedRequests = await requestRepository
            .createQueryBuilder('request')
            .leftJoinAndSelect('request.address', 'address')
            .leftJoinAndSelect('request.qualifications', 'qualifications')
            .where('address.city = :city', { city: requestedCity })
            .getMany()
        console.log('Found ' + locationMatchedRequests.length + ' location matches')

        const qualificationMatchedRequests = locationMatchedRequests.filter((request) =>
            matchesUserQualifications(request, userQualifications)
        )
        console.log('Found ' + qualificationMatchedRequests.length + ' location+qualification matches')

        if (!locationMatchedRequests) {
            return lambdaResponse(404, 'No Requests match the given query')
        }
        return lambdaResponse(200, qualificationMatchedRequests)
    } catch (e) {
        console.log(`Error during lambda execution: ${e}`)
        return lambdaResponse(500, JSON.stringify(e))
    } finally {
        await db.disconnect(connection)
    }
}
