import Organisation from "../../../common/help-on-spot-models/dist/entity/Organisation";

require('dotenv').config();

import {Database} from "../../../common/help-on-spot-models/dist/utils/Database";
import {LambdaResponse, lambdaResponse} from "../../../common/help-on-spot-models/dist/utils/lambdaResponse";


export const handler = async(): Promise<LambdaResponse> => {
    const database = new Database();
    const connection = await database.getConnection();
    try {
        const organisations: Organisation[] = await connection.getRepository(Organisation).find({relations: ['responsibles', 'address']})
        console.log(`Found ${organisations.length} organisations`)
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


