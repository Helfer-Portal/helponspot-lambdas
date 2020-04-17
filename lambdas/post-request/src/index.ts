
require('dotenv').config();

import {RequestData} from "../../../common/help-on-spot-models/dist/models/RestModels";
import {Database} from "../../../common/help-on-spot-models/dist/utils/Database";
import {lambdaResponse, LambdaResponse} from "../../../common/help-on-spot-models/dist/utils/lambdaResponse";



export interface LambdaInputEvent {
    body: string
}



export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
    console.log(JSON.parse(event.body))
    const requestData: RequestData = JSON.parse(event.body)

    const db = new Database();
    try {
        const connection = await db.connect();
        return lambdaResponse(200, JSON.stringify(requestData))
    } catch (e) {
        console.log(`Error during lambda execution:\n ${JSON.stringify(e)}`)
        return lambdaResponse(500, JSON.stringify(e))
    } finally {
        await db.disconnect()
    }
}
