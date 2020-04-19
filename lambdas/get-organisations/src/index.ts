require('dotenv').config();

import Organisation from "../../../common/help-on-spot-models/dist/entity/Organisation";
import {Database} from "../../../common/help-on-spot-models/dist/utils/Database";
import {LambdaResponse, lambdaResponse} from "../../../common/help-on-spot-models/dist/utils/lambdaResponse";

export interface LambdaInputEvent {
    path?: string
    pathParameters?: { organisationId: string }
}

export const handler = async (event?: LambdaInputEvent): Promise<LambdaResponse> => {
    const database = new Database();
    const connection = await database.getConnection();
    let organisations: Organisation[] | undefined
    try {
        if (event?.pathParameters?.organisationId) {
            organisations = await connection.getRepository(Organisation).find({
                where: {id: event.pathParameters.organisationId},
                relations: ['responsibles', 'address']
            })
        } else {
            organisations = await connection.getRepository(Organisation).find({relations: ['responsibles', 'address']})
        }
        console.log(`Found ${organisations!.length} organisations`)
        if (organisations) {
            return lambdaResponse(200, organisations)
        } else {
            return lambdaResponse(404, `No organisations found`)
        }
    } catch (e) {
        console.log(`Error during lambda execution:\n ${e}`)
        return lambdaResponse(500, JSON.stringify(e))
    } finally {
        await database.disconnect(connection)
    }
}


