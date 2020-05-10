import User from '/opt/nodejs/common/help-on-spot-models/dist/entity/User'
import { LambdaResponse, lambdaResponse } from '/opt/nodejs/common/help-on-spot-models/dist/utils/lambdaResponse'
import { Database } from '/opt/nodejs/common/help-on-spot-models/dist/utils/Database'
import RequestResponse from '/opt/nodejs/common/help-on-spot-models/dist/entity/RequestResponse'
import { Connection } from '/opt/nodejs/common/help-on-spot-models/dist'

export interface LambdaInputEvent {
    pathParameters: { userId: string }
}

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
    const { userId } = event.pathParameters
    const db = new Database()
    const connection = await db.getConnection()

    if (!connection) {
        return lambdaResponse(500, 'No Database connection')
    }

    try {
        const userRepository = connection.getRepository(User)
        const user: User | undefined = await userRepository.findOne({
            where: { id: userId },
            relations: ['address', 'requestResponses']
        })
        if (user) {
            await deleteRequestReponses(user, connection)
            await userRepository.delete(userId)
            console.log(`Removed User: '${userId}'`)
            return lambdaResponse(200, 'User deleted successfully')
        } else {
            return lambdaResponse(404, 'User does not exist')
        }
    } catch (e) {
        console.log(`Error during lambda execution:\n ${JSON.stringify(e)}`)
        return lambdaResponse(500, e)
    } finally {
        await db.disconnect(connection)
    }
}

async function deleteRequestReponses(user: User, connection: Connection) {
    const responses = user.requestResponses
    if (responses) {
        for (const response of responses) {
            await connection.getRepository(RequestResponse).delete({ id: response.id })
        }
    }
}
