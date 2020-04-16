require('dotenv').config();
import {Address, Connection, Qualification, User} from "../../../common/help-on-spot-models/dist";
import {Database} from "../../../common/help-on-spot-models/dist/utils/Database";

interface LambdaResponse {
  isBase64Encoded: boolean
  statusCode: number
  body: string
  headers: any
}

export interface LambdaInputEvent {
  body: string
}

interface UserData {
  firstName: string;
  lastName: string;
  isGPSLocationAllowed: boolean;
  email: string;
  avatar: string;
  qualifications: string[];
  address: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    country: string;
  }
}

const defaultHeader = {
  'Content-Type': 'application/json'
}

// TODO: Use lambdaResponse everywhere (maybe move to utils)
// TODO: Save qualification relationship properly

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
  console.log(JSON.parse(event.body))

  const userData: UserData = JSON.parse(event.body)

  const db = new Database();
  const connection = await db.connect();

  if (!connection) {
    return lambdaResponse(500, 'Database connection');
  }

  if (!(await validateRequest(userData.qualifications, connection))) {
    return {
      isBase64Encoded: false,
      statusCode: 400,
      body: 'Qualifications are not valid!',
      headers: defaultHeader
    }
  }

  const user = new User(
    userData.firstName,
    userData.lastName,
    userData.isGPSLocationAllowed,
    userData.email,
    userData.avatar
  );

  if (userData.address) {
    const address = userData.address;
    user.address = new Address(address.street, address.houseNumber, address.postalCode, address.city, address.country);
  }


  const userRepository = connection!.getRepository(User);

  try {
    const savedUser: User = await userRepository.save(user);
    return {
      isBase64Encoded: false,
      statusCode: 200,
      body: JSON.stringify(savedUser),
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

async function validateRequest(qualifications: string[], connection: Connection): Promise<boolean> {
  const qualificationRepository = connection.getRepository(Qualification);

  for (const qualification of qualifications) {
    const qualificationFound = await qualificationRepository.findOne({ where: { name: qualification } });
    if (!qualificationFound) {
      return false;
    }
  }

  return true;
}

function lambdaResponse (statusCode: number, message: string) {
  return {
    isBase64Encoded: false,
    statusCode,
    body: message,
    headers: defaultHeader
  }
}
