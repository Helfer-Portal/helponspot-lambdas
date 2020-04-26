require('dotenv').config()
import { User } from '../../../common/help-on-spot-models/dist'
import { Database } from '../../../common/help-on-spot-models/dist/utils/Database'
import { LambdaResponse, lambdaResponse } from '../../../common/help-on-spot-models/dist/utils/lambdaResponse'

export interface LambdaInputEvent {
    pathParameters: any
}

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
    const userId = event.pathParameters.userId
    const db = new Database()
    const connection = await db.getConnection()
    try {
        const repo = connection.getRepository(User)
        const user: User | undefined = await repo.findOne({
            where: { id: userId },
            relations: ['address', 'qualifications', 'organisations']
        })
        if (!user) {
            return lambdaResponse(404, 'User not found!')
        }
        return lambdaResponse(200, JSON.stringify(user))
    } catch (e) {
        console.log(`Error during lambda execution: ${JSON.stringify(e)}`)
        return lambdaResponse(500, JSON.stringify(e))
    } finally {
        await db.disconnect(connection)
    }
}
