require('dotenv').config();
import {Qualification} from "../../../common/help-on-spot-models/dist";
import {Database} from "../../../common/help-on-spot-models/dist/utils/Database";

interface LambdaResponse {
  isBase64Encoded: boolean
  statusCode: number
  body: string
  headers: any
}

export interface LambdaInputEvent {}

const defaultHeader = {
  'Content-Type': 'application/json'
}

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
  const db = new Database();
  const connection = await db.connect();
  
  try {
      const repo = connection!.getRepository(Qualification)
      const qualifications: Qualification[] = await repo!.find();
      return {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify(qualifications),
        headers: defaultHeader,
      };
  } catch (e) {
    console.log(`Error during lambda execution: ${JSON.stringify(e)}`)
    return {
      isBase64Encoded: false,
      statusCode: 500,
      body: JSON.stringify(e),
      headers: defaultHeader
    }
  }
  finally {
      await db.disconnect()
  }
}
