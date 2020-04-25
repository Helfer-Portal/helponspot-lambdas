import Organisation from "../../../common/help-on-spot-models/dist/entity/Organisation";

require('dotenv').config();

import {handler, LambdaInputEvent} from "./index";
import {Database} from "../../../common/help-on-spot-models/dist/utils/Database";
import {Address, Qualification, User} from "../../../common/help-on-spot-models/dist";
import {AddressData, OrganisationData, RequestData} from "../../../common/help-on-spot-models/dist/models/RestModels";
import Request from "../../../common/help-on-spot-models/dist/entity/Request";

(async function () {

    const connection = await new Database().getConnection()
    const userRepo = connection!.getRepository(User)
    const orgRepo = connection!.getRepository(Organisation)
    const adata: AddressData = {country: "germany", city: "myyCity", postalCode: "123", houseNumber: "1", street: "street"}
    const address = await  connection.getRepository(Address).save(new Address(adata))

    const qualifications = await connection.getRepository(Qualification).find()
    const randomEmail = Math.random().toString(36).substring(7) + "@test"
    const user = new User(randomEmail, false, qualifications.filter(q => q.key === "physicallyFit", "Test", "User"))
    user.address = address
    await userRepo.save(user)
    const addressData: AddressData = {city: "c", country: "c", houseNumber: "h", postalCode: "1", street: "s"}
    const organ: OrganisationData = {address: addressData, email: "@lo", logoPath: "l", name: "o", responsibles: []}
    const organisation = await orgRepo.save(new Organisation(organ, [user]))

    let requestData: RequestData = {
        title: "huhu",
        address: {
            street: "string",
            postalCode: "string",
            houseNumber: "string",
            city: "myyCity",
            country: "string"
        },
        description: "desc",
        endDate: "2004-07-11",
        startDate: "2004-07-12",
        isActive: false,
        qualificationKeys: ["physicallyFit"]

    }
    await connection.getRepository(Request).save(new Request(requestData, organisation, []))
    await connection.getRepository(Request).save(new Request(requestData, organisation, qualifications.filter(q => q.key === "physicallyFit")))
    await connection.getRepository(Request).save(new Request(requestData, organisation, qualifications.filter(q => q.key === "driversLicence")))

    await connection.close();

  const requestObject: LambdaInputEvent = {
    pathParameters: {
      userId: user.id!
    }
  }

  const result = await handler(requestObject)

  console.log(JSON.stringify(result))
})()
