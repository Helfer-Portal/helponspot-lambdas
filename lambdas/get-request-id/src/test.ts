import {handler, LambdaInputEvent} from './index'
import {AddressData, OrganisationData, RequestData} from "../../../common/help-on-spot-models/dist/models/RestModels";

import {Database} from "../../../common/help-on-spot-models/dist/utils/Database";
import {User} from "../../../common/help-on-spot-models/dist";
import Organisation from "../../../common/help-on-spot-models/dist/entity/Organisation";
import Request from "../../../common/help-on-spot-models/dist/entity/Request";
(async function () {

    const connection = await new Database().getConnection()
    const userRepo = connection!.getRepository(User)
    const orgRepo = connection!.getRepository(Organisation)

    const randomEmail = Math.random().toString(36).substring(7) + "@test"
    const user = await userRepo.save(new User("Test", "User", false, randomEmail, "", []))
    const addressData: AddressData = {city: "c", country: "c", houseNumber: "h", postalCode: "1", street: "s"}
    const organ: OrganisationData = {address: addressData, email: "@lo", logoPath: "l", name: "o", responsibles: []}
    const organisation = await orgRepo.save(new Organisation(organ, [user]))

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
        qualifiactionKeys: ["physicallyFit"]

    }
    const request = new Request(requestData, organisation, [])
    await connection.getRepository(Request).save(request)
    await connection!.close()

    const requestObject: LambdaInputEvent = {
        pathParameters: {requestId: request.id!},
        body: '',
        path: '////'
    }
    const result = await handler(requestObject)

    console.log('result\n--------------------\n')
    console.log(JSON.stringify(result))
})()
