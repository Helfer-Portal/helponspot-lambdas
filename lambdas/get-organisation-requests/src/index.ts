require('dotenv').config();

import Organisation from "../../../common/help-on-spot-models/dist/entity/Organisation";
import {Database} from "../../../common/help-on-spot-models/dist/utils/Database";
import {LambdaResponse, lambdaResponse} from "../../../common/help-on-spot-models/dist/utils/lambdaResponse";

export interface LambdaInputEvent {
  pathParameters: any
}

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
  const organisationId = event.pathParameters.organisationId;
  const db = new Database();
  const connection = await db.getConnection();
  let organisation: Organisation | undefined;
  try {
      const repo = connection.getRepository(Organisation);
      organisation = await repo.findOne({ where: { id: organisationId }, relations: ['requests'] });
      if (!organisation) {
        return lambdaResponse(404, "Organisation not found!");
      }
      return lambdaResponse(200, JSON.stringify(organisation?.requests));
  } catch (e) {
    console.log(`Error during lambda execution: ${JSON.stringify(e)}`)
    return lambdaResponse(500, JSON.stringify(e));
  }
  finally {
      await db.disconnect(connection)
  }

}
