import {handler, LambdaInputEvent} from "./index";
import {Database} from "../../../common/help-on-spot-models/dist/utils/Database";
import {In, Qualification, User} from "../../../common/help-on-spot-models/dist";
import Organisation from "../../../common/help-on-spot-models/dist/entity/Organisation";
import Request from "../../../common/help-on-spot-models/dist/entity/Request";
import {AddressData, OrganisationData, RequestData} from "../../../common/help-on-spot-models/dist/models/RestModels";

(async function () {

  const connection = await new Database().getConnection()
  const userRepo = connection!.getRepository(User)
  const orgRepo = connection!.getRepository(Organisation)
  const requestRepo = connection!.getRepository(Request)

  const randomEmail = Math.random().toString(36).substring(7) + "@test"
  const user = await userRepo.save(new User(randomEmail, false, [], "Test", "User"))
  const address: AddressData = {city: "c", country: "c", houseNumber: "h", postalCode: "1", street: "s"}
  const orgData: OrganisationData = {address: address, email: "@lo", logoPath: "l", name: "o", responsibles: []}
  const org = await orgRepo.save(new Organisation(orgData, [user]))
  const requestData: RequestData = {
    title: "huhu",
    address: {
      street: "string",
      postalCode: "string",
      houseNumber: "string",
      city: "string",
      country: "string"
    },
    description: "desc",
    endDate: "2004-07-11",
    startDate: "2004-07-12",
    isActive: false,
    qualificationKeys: ["physicallyFit"]
  }
  const qualifications = await connection.getRepository(Qualification).find({key: In(requestData.qualificationKeys)})
  const request = await requestRepo.save(new Request(requestData, org, qualifications))
  console.log(request);

  await connection!.close()

  const requestObject: LambdaInputEvent = {
    pathParameters: {
      organisationId: "org.id"
    }
  }

  const result = await handler(requestObject)

  console.log(JSON.stringify(result))
})();
