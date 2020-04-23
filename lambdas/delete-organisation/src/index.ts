require('dotenv').config();

import {LambdaResponse, lambdaResponse} from '/opt/nodejs/common/help-on-spot-models/dist/utils/lambdaResponse';
import Organisation from '/opt/nodejs/common/help-on-spot-models/dist/entity/Organisation';
import {Database} from '/opt/nodejs/common/help-on-spot-models/dist/utils/Database';

export interface LambdaInputEvent {
    pathParameters: LamdaPathParams
}

export interface LamdaPathParams {
    [key: string]: string
}

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
    const { organisationId } = event.pathParameters;
    const db = new Database();
    const connection = await db.getConnection();

    if (!connection) {
        return lambdaResponse(500, 'No Database connection');
    }

    try {
        const organisationRepo = connection.getRepository(Organisation);
        await organisationRepo.delete(organisationId);
        console.log(`Removed Organisation: ${organisationId}`);
        return lambdaResponse(200, '');
    } catch (e) {
        console.log(`Error during lambda execution:\n ${JSON.stringify(e)}`);
        return lambdaResponse(500, e);
    } finally {
        await db.disconnect(connection);
    }
}
