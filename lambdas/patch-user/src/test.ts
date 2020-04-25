import {  handler, LambdaInputEvent } from './index'
import {Database} from "../../../common/help-on-spot-models/dist/utils/Database";
import {User} from "../../../common/help-on-spot-models/dist";

(async function () {

  const connection = await new Database().getConnection();
  const userRepo = connection.getRepository(User);

  const randomEmail = Math.random().toString(36).substring(7) + "@test";
  const user = await userRepo.save(new User(randomEmail, false, [], "Test", "User"));
  await connection.close();

  const patchUser = {
    firstName: "Max neu",
    lastName: "Mustermann neu",
    isGPSLocationAllowed: true,
    email: "test@neu123.de",
    avatar: "new_picture.jpg",
    address: {
      houseNumber: "1337 asdas b",
      city: "Essen adsad",
      street: "Hauptsadasstraße",
      postalCode: "123 asd",
      country: "Malt asdasa"
    },
   qualifications: [
      "medicalEducation",
      "driversLicence"
    ]
  }
  const requestObject: LambdaInputEvent = {
    body: JSON.stringify(patchUser),
    pathParameters: {
      userId: user.id
    }
  }
  const result = await handler(requestObject)
  console.log(JSON.stringify(result))
})()
