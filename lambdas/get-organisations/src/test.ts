import {handler} from './index'
import {AddressData, OrganisationData} from "../../../common/help-on-spot-models/dist/models/RestModels";

import {Database} from "../../../common/help-on-spot-models/dist/utils/Database";
import {User} from "../../../common/help-on-spot-models/dist";
import Organisation from "../../../common/help-on-spot-models/dist/entity/Organisation";
(async function () {

    const connection = await new Database().getConnection()
    const userRepo = connection!.getRepository(User)
    const orgRepo = connection!.getRepository(Organisation)

    const randomEmail = Math.random().toString(36).substring(7) + "@test"
    const user = await userRepo.save(new User("Test", "User", false, randomEmail, "", []))
    const addressData: AddressData = {city: "c", country: "c", houseNumber: "h", postalCode: "1", street: "s"}
    const organisationData: OrganisationData = {address: addressData, email: "@lo", logoPath: "l", name: "o", responsibles: []}
    await orgRepo.save(new Organisation(organisationData, [user]))
    await connection!.close()

    const result = await handler()
    console.log('result\n--------------------\n')
    console.log(JSON.stringify(result, null, 2))
})()
