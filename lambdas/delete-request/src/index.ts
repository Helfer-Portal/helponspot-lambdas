import { LambdaResponse, lambdaResponse } from '../../../common/help-on-spot-models/dist/utils/lambdaResponse'
import { Database } from '../../../common/help-on-spot-models/dist/utils/Database'
import RequestResponse from '../../../common/help-on-spot-models/dist/entity/RequestResponse'
import { Connection } from '../../../common/help-on-spot-models/dist'
import Request from '../../../common/help-on-spot-models/dist/entity/Request'

export interface LambdaInputEvent {
    pathParameters: { requestId: string }
}

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
    const { requestId } = event.pathParameters
    const db = new Database()
    const connection = await db.getConnection()

    if (!connection) {
        return lambdaResponse(500, 'No Database connection')
    }

    try {
        const requestRepository = connection.getRepository(Request)
        const request: Request | undefined = await requestRepository.findOne({
            where: { id: requestId },
            relations: ['address', 'requestResponses']
        })
        if (request) {
            await deleteRequestReponses(request, connection)
            await requestRepository.delete(requestId)
            console.log(`Removed Request: '${requestId}'`)
            return lambdaResponse(200, 'Request deleted successfully')
        } else {
            return lambdaResponse(404, 'Request does not exist')
        }
    } catch (e) {
        console.log(`Error during lambda execution:\n ${JSON.stringify(e)}`)
        return lambdaResponse(500, e)
    } finally {
        await db.disconnect(connection)
    }
}

async function deleteRequestReponses(request: Request, connection: Connection) {
    const responses = request.requestResponses
    if (responses) {
        for (const response of responses) {
            await connection.getRepository(RequestResponse).delete({ id: response.id })
        }
    }
}
