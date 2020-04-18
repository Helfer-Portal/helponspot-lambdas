require('dotenv').config();

import { LambdaResponse, lambdaResponse } from "../../../common/help-on-spot-models/dist/utils/lambdaResponse";
import { RequestData } from "../../../common/help-on-spot-models/dist/models/RestModels";
import { Database } from "../../../common/help-on-spot-models/dist/utils/Database";
import { Connection, In, Qualification, User } from "../../../common/help-on-spot-models/dist/index";
import Organisation from "../../../common/help-on-spot-models/dist/entity/Organisation";
import Request from "../../../common/help-on-spot-models/dist/entity/Request";
import RequestResponse, { ResponseRequestStatus } from "../../../common/help-on-spot-models/dist/entity/RequestResponse";

export interface LambdaInputEvent {
    body: string
    path: string
    pathParameters: any
}

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
    const requestId = event.pathParameters.requestId;
    const userId = event.pathParameters.userId;

    const dto = JSON.parse(event.body)

    if (dto?.response === undefined || dto?.response === undefined) {
        return lambdaResponse(400, {
            error: "'response' missing"
        })
    }
    if (!Object.values(ResponseRequestStatus).includes(dto.response)) {
        return lambdaResponse(400, {
            error: `${dto.response} is not a valid response`
        })
    }

    const db = new Database();
    const connection = await db.getConnection();

    const request = await connection!.getRepository(Request).findOne(requestId);
    if (!request) {
        return lambdaResponse(404, {
            error: "Request not found"
        })
    }

    const user = await connection!.getRepository(User).findOne(userId);
    if (!user) {
        return lambdaResponse(404, {
            error: "User not found",
        });
    }

    let rResp = await connection!.getRepository(RequestResponse).findOne({
        requestId: request.id,
        userId: user.id,
    })
    if(rResp === null || rResp === undefined) {
        rResp = new RequestResponse();
        rResp.userId = user.id;
        rResp.requestId = request.id;
    }
    rResp.status = dto.response;
    const savedResponse = await connection!.getRepository(RequestResponse).save(rResp);
    return lambdaResponse(200, {
        id: savedResponse.id,
        status: savedResponse.status,
        createTime: savedResponse.createTime,
        updateTime: savedResponse.updateTime,
        userId: savedResponse.userId,
        request: request,
    });
}

