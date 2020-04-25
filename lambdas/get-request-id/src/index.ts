require('dotenv').config()

import { Database } from '../../../common/help-on-spot-models/dist/utils/Database'
import { LambdaResponse, lambdaResponse } from '../../../common/help-on-spot-models/dist/utils/lambdaResponse'
import Request from '../../../common/help-on-spot-models/dist/entity/Request'

export interface LambdaInputEvent {
    body: string
    path: string
    pathParameters: { requestId: string }
}

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
    const requestId = event.pathParameters.requestId
    console.log(`Searching request for id: '${requestId}'`)

    const database = new Database()
    const connection = await database.getConnection()
    try {
        const request: Request | undefined = await connection
            .getRepository(Request)
            //TODO: Once authentication is in place, adjust relations depending of the user access level
            .findOne({
                where: { id: requestId },
                relations: ['address', 'qualifications', 'organisation', 'requestResponses']
            })
        if (request) {
            return lambdaResponse(200, JSON.stringify(request))
        } else {
            return lambdaResponse(404, `No Request found for id: '${requestId}'`)
        }
    } catch (e) {
        console.log(`Error during lambda execution:\n ${e}`)
        return lambdaResponse(500, JSON.stringify(e))
    } finally {
        await database.disconnect(connection)
    }
}
