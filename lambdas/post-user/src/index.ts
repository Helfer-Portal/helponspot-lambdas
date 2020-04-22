require('dotenv').config();

import {AddressData} from "../../../common/help-on-spot-models/dist/models/RestModels";
import {LambdaResponse, lambdaResponse} from "../../../common/help-on-spot-models/dist/utils/lambdaResponse";
import {Address, Connection, Qualification, User, In, Repository} from "../../../common/help-on-spot-models/dist";
import {Database} from "../../../common/help-on-spot-models/dist/utils/Database";
import {getPointFromGeoservice} from "../../../common/help-on-spot-models/dist/utils/getGeolocation";


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
  address: AddressData
}

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
  console.log(JSON.parse(event.body))

  const userData: UserData = JSON.parse(event.body)

  const db = new Database();
  const connection = await db.getConnection();

  if (!connection) {
    return lambdaResponse(500, 'No Database connection');
  }

  const userRepository = connection!.getRepository(User);

  const email = await findEmail(userData.email, userRepository);

  if (email) {
    await db.disconnect(connection)
    return lambdaResponse(400, 'User with email already exists!')
  }

  const qualifications = await findQualifications(userData.qualifications, connection);

  if (qualifications.length !== userData.qualifications.length) {
    await db.disconnect(connection)
    return lambdaResponse(400, 'Some qualifications are not valid!');
  }

  const user = new User(
    userData.firstName,
    userData.lastName,
    userData.isGPSLocationAllowed,
    userData.email,
    userData.avatar,
    qualifications
  );

  try {
    if (userData.address) {
      user.address = new Address(userData.address);
      user.address.point = {
        type: "Point",
        coordinates: await getPointFromGeoservice(userData.address)
      };
    }
    const savedUser: User = await userRepository.save(user);
    return lambdaResponse(200, JSON.stringify(savedUser));
  } catch (e) {
    console.log(`Error during lambda execution: ${JSON.stringify(e)}`)
    return lambdaResponse(500, JSON.stringify(e));
  }
  finally {
      await db.disconnect(connection)
  }
}

async function findQualifications(qualifications: string[], connection: Connection): Promise<Qualification[]> {
  const qualificationRepository = connection.getRepository(Qualification);

  return qualificationRepository.find({
    key: In(qualifications)
  });
}

async function findEmail(email: string, userRepository: Repository<User>): Promise<User | undefined> {
  return userRepository.findOne({
    where: { email: email }
  });
}
