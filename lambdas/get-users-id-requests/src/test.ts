import {handler, LambdaInputEvent} from "./index";
import {Database} from "../../../common/help-on-spot-models/dist/utils/Database";
import {Address, Qualification, User} from "../../../common/help-on-spot-models/dist";
import {AddressData} from "../../../common/help-on-spot-models/dist/models/RestModels";

(async function () {


    const connection = await new Database().getConnection();
    const userRepo = connection.getRepository(User);
    const qualifications = await connection.getRepository(Qualification).find()
    const randomEmail = Math.random().toString(36).substring(7) + "@test";
    const adata: AddressData = {country: "germany", city: "myCity", postalCode: "123", houseNumber: "1", street: "street"}
    const address = await  connection.getRepository(Address).save(new Address(adata))

    const user = new User("Test", "User", false, randomEmail, "", [qualifications[2]])
    user.address = address
    await userRepo.save(user);
    await connection.close();

  const requestObject: LambdaInputEvent = {
    pathParameters: {
      userId: user.id!
    }
  }

  const result = await handler(requestObject)

  console.log(JSON.stringify(result))
})()
