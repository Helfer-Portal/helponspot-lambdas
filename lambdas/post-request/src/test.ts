import {handler, LambdaInputEvent} from './index'
import {AddressData, OrganisationData, RequestData} from "../../../common/help-on-spot-models/dist/models/RestModels";

import {Database} from "../../../common/help-on-spot-models/dist/utils/Database";
import {User} from "../../../common/help-on-spot-models/dist";
import Organisation from "../../../common/help-on-spot-models/dist/entity/Organisation";
(async function () {

    const connection = await new Database().getConnection()
    const userRepo = connection!.getRepository(User)
    const orgRepo = connection!.getRepository(Organisation)

    const randomEmail = Math.random().toString(36).substring(7) + "@test"
    const user = await userRepo.save(new User("Test", "User", false, randomEmail, "", []))
    const address: AddressData = {city: "c", country: "c", houseNumber: "h", postalCode: "1", street: "s"}
    const orgData: OrganisationData = {address: address, email: "@lo", logoPath: "l", name: "o", responsibles: []}
    const org = await orgRepo.save(new Organisation(orgData, [user]))
    await connection!.close()

    const requestData: RequestData = {
        title: "huhu",
        address: {
            street: "string",
            postalCode: "string",
            houseNumber: "string",
            city: "myCity",
            country: "string"
        },
        description: "desc",
        endDate: "2004-07-11",
        startDate: "2004-07-12",
        isActive: false,
        qualificationKeys: ["medicalEducation"]
    }
    const requestObject: LambdaInputEvent = {
        body: JSON.stringify(requestData),
        path: `/organisations/${org.id}/requests`,
        pathParameters: {organisationId: org.id}
    }
    const result = await handler(requestObject)

    console.log('result\n--------------------\n')
    console.log(JSON.stringify(result))
})()
