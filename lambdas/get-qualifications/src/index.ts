require('dotenv').config()
import { Qualification } from '/opt/nodejs/common/help-on-spot-models/dist'
import { Database } from '/opt/nodejs/common/help-on-spot-models/dist/utils/Database'
import { LambdaResponse, lambdaResponse } from '/opt/nodejs/common/help-on-spot-models/dist/utils/lambdaResponse'

export const handler = async (): Promise<LambdaResponse> => {
    const db = new Database()
    const connection = await db.getConnection()
    try {
        const repo = connection!.getRepository(Qualification)
        const qualifications: Qualification[] = await repo!.find()
        return lambdaResponse(200, JSON.stringify(qualifications))
    } catch (e) {
        console.log(`Error during lambda execution: ${JSON.stringify(e)}`)
        return lambdaResponse(500, JSON.stringify(e))
    } finally {
        await db.disconnect(connection)
    }
}
