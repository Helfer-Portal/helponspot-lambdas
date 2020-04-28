import { handler, LambdaInputEvent } from './index'
import { Database } from '/opt/nodejs/common/help-on-spot-models/dist/utils/Database'
import { Address, Qualification, User } from '/opt/nodejs/common/help-on-spot-models/dist'
import Organisation from '/opt/nodejs/common/help-on-spot-models/dist/entity/Organisation'
import { AddressData, OrganisationData } from '/opt/nodejs/common/help-on-spot-models/dist/models/RestModels'

describe("get qualifications handler", () => {
    it("should return status 200", async () => {
        const connection = await new Database().getConnection()
        const userRepo = connection!.getRepository(User)
        const orgRepo = connection!.getRepository(Organisation)
        const adata: AddressData = {
            country: 'germany',
            city: 'myyCity',
            postalCode: '123',
            houseNumber: '1',
            street: 'street'
        }
        const address = await connection.getRepository(Address).save(new Address(adata))

        const qualifications = await connection.getRepository(Qualification).find()
        const randomEmail = Math.random().toString(36).substring(7) + '@test'
        const user = new User(
            randomEmail, 
            false, 
            qualifications.filter((q) => q.key === 'physicallyFit'),
            'Test', 
            'User', 
            "", 
            1
        )
        user.address = address
        const savedUser = await userRepo.save(user)
        const addressData: AddressData = { city: 'c', country: 'c', houseNumber: 'h', postalCode: '1', street: 's' }
        const organ: OrganisationData = { address: addressData, email: '@lo', logoPath: 'l', name: 'o', responsibles: [] }
        await orgRepo.save(new Organisation(organ, [user]))

        const requestObject: LambdaInputEvent = {
            pathParameters: {
                userId: savedUser.id
            }
        }

        const result = await handler(requestObject)
        expect(result.statusCode).toEqual(200)
    })
})
