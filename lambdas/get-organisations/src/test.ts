import { handler } from './index'
import { AddressData, OrganisationData } from '/opt/nodejs/common/help-on-spot-models/dist/models/RestModels'

import { Database } from '/opt/nodejs/common/help-on-spot-models/dist/utils/Database'
import { User } from '/opt/nodejs/common/help-on-spot-models/dist'
import Organisation from '/opt/nodejs/common/help-on-spot-models/dist/entity/Organisation'

describe("get organisations handler", () => {
    it("should return status 200", async () => {
        const connection = await new Database().getConnection()
        const userRepo = connection!.getRepository(User)
        const orgRepo = connection!.getRepository(Organisation)
    
        const randomEmail = Math.random().toString(36).substring(7) + '@test'
        const user = await userRepo.save(new User(randomEmail, false, [], 'Test', 'User', '', 1))
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
        expect(singleResult.statusCode).toEqual(200);
        
        const allResult = await handler()        
        expect(allResult.statusCode).toEqual(200)
    })    
})