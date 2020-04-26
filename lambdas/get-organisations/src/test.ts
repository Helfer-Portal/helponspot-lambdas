import { handler } from './index'
import { AddressData, OrganisationData } from '../../../common/help-on-spot-models/dist/models/RestModels'

import { Database } from '../../../common/help-on-spot-models/dist/utils/Database'
import { User } from '../../../common/help-on-spot-models/dist'
import Organisation from '../../../common/help-on-spot-models/dist/entity/Organisation'
;(async function () {
    const connection = await new Database().getConnection()
    const userRepo = connection!.getRepository(User)
    const orgRepo = connection!.getRepository(Organisation)

    const randomEmail = Math.random().toString(36).substring(7) + '@test'
    const user = await userRepo.save(new User('Test', 'User', false, randomEmail, '', 1, []))
    const addressData: AddressData = { city: 'c', country: 'c', houseNumber: 'h', postalCode: '1', street: 's' }
    const organisationData: OrganisationData = {
        address: addressData,
        email: '@lo',
        logoPath: 'l',
        name: 'o',
        responsibles: []
    }
    const organisation = await orgRepo.save(new Organisation(organisationData, [user]))
    const organisation2 = await orgRepo.save(new Organisation(organisationData, [user]))
    await connection!.close()

    const singleResult = await handler({ pathParameters: { organisationId: organisation.id! } })
    console.log('search with Id\n--------------------\n')
    console.log(JSON.stringify(singleResult, null, 2))

    const allResult = await handler()
    console.log('\nsearch without Id\n--------------------\n')
    console.log(JSON.stringify(allResult, null, 2))
})()
