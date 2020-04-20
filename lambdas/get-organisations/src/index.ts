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
    let result: Organisation[] | Organisation | undefined
    try {
        if (event?.pathParameters?.organisationId) {
            result = await connection.getRepository(Organisation).findOne({
                where: {id: event.pathParameters.organisationId},
                relations: ['responsibles', 'address']
            })
            if(result) {
                console.log('Found one organisation')
            }
        } else {
            result = await connection.getRepository(Organisation).find({relations: ['responsibles', 'address']})
            console.log(`Found '${result!.length}' organisations`)
        }
        if (result) {
            return lambdaResponse(200, result)
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


