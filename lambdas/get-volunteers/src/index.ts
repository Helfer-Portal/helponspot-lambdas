import { LambdaResponse, lambdaResponse } from "../../../common/help-on-spot-models/dist/utils/lambdaResponse";
import { Database } from "../../../common/help-on-spot-models/dist/utils/Database";
import RequestResponse from "../../../common/help-on-spot-models/dist/entity/RequestResponse";

export interface LambdaInputEvent {
    body: string
    path: string
    queryStringParameters: any
    pathParameters: any
}

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
    const requestId = event.pathParameters.requestId;
    const userId = event.pathParameters.userId;

    const db = new Database();
    const connection = await db.getConnection();

    const responses = await connection!.getRepository(RequestResponse).find({
        where: {
            requestId: requestId,
            status: event.queryStringParameters?.status
        },
    });

    await db.disconnect(connection);

    return lambdaResponse(200, JSON.stringify(responses));
}

