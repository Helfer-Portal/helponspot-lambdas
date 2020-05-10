require('dotenv').config()
import { Connection, User } from '/opt/nodejs/common/help-on-spot-models/dist'
import { Database } from '/opt/nodejs/common/help-on-spot-models/dist/utils/Database'
import { LambdaResponse, lambdaResponse } from '/opt/nodejs/common/help-on-spot-models/dist/utils/lambdaResponse'

export interface LambdaInputEvent {
    pathParameters: any
}

const relevantRelations: string[] = ['address', 'qualifications', 'organisations']

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
    const userId = event.pathParameters.userId
    const db = new Database()
    const connection = await db.getConnection()
    try {
        const user = await findUser(userId, connection)
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

async function findUser(userId: string, connection: Connection): Promise<User | undefined> {
    const repo = connection.getRepository(User)
    if (isEmail(userId)) {
        return await repo.findOne({
            where: { email: userId },
            relations: relevantRelations
        })
    } else {
        return await repo.findOne({
            where: { id: userId },
            relations: relevantRelations
        })
    }
}

function isEmail(userId: string): boolean {
    return userId.includes('@')
}
