import dotenv from 'dotenv'
import {Database} from "./Database";
import User from "./User";

interface LambdaResponse {
  isBase64Encoded: boolean
  statusCode: number
  body: string
  headers: any
}

export interface LambdaInputEvent {
  body: string
}

const defaultHeader = {
  'Content-Type': 'application/json'
}

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
  dotenv.config()
  console.log(JSON.parse(event.body))

  const userData: User = JSON.parse(event.body)

  let user = new User(userData.firstName, userData.lastName, userData.isGPSLocationAllowed, userData.avatar);
  const db = new Database();
  const connection = await db.connect();

  let savedUser: User;

  try {
    await connection!.manager.save(user).then(user => savedUser = user);
    return {
      isBase64Encoded: false,
      statusCode: 200,
      body: JSON.stringify(savedUser!),
      headers: defaultHeader
    }
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
