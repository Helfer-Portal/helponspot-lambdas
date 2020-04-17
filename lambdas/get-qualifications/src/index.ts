require('dotenv').config();
import {Qualification} from "../../../common/help-on-spot-models/dist";
import {Database} from "../../../common/help-on-spot-models/dist/utils/Database";
import {LambdaResponse, lambdaResponse} from "../../../common/help-on-spot-models/dist/utils/lambdaResponse";

export interface LambdaInputEvent {}

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
  const db = new Database();
  const connection = await db.connect();
  try {
      const repo = connection!.getRepository(Qualification)
      const qualifications: Qualification[] = await repo!.find();
      return lambdaResponse(200, JSON.stringify(qualifications));
  } catch (e) {
    console.log(`Error during lambda execution: ${JSON.stringify(e)}`)
    return lambdaResponse(500, JSON.stringify(e));
  }
  finally {
      await db.disconnect()
  }
}
