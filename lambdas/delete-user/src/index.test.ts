require('dotenv').config()
import { handler, LambdaInputEvent } from './index'
import { OrganisationData, AddressData } from '../../../common/help-on-spot-models/src/models/RestModels'
import { Database } from '../../../common/help-on-spot-models/src/utils/Database'
import User from '../../../common/help-on-spot-models/dist/entity/User'
import Organisation from '../../../common/help-on-spot-models/dist/entity/Organisation'

describe('delete user handler', () => {
    it('should return status 500 when user id is invalid', async () => {
        const inputEvent: LambdaInputEvent = {
            pathParameters: {
                userId: 'invalid-id'
            }
        }

        const result = await handler(inputEvent)
        expect(result.statusCode).toEqual(500)
    })

    it('should return status 200', async () => {
        const createdOrganisation: Organisation = await createOrganisation()
        const inputEvent: LambdaInputEvent = {
            pathParameters: {
                userId: createdOrganisation.responsibles![0]!.id!
            }
        }
        const result = await handler(inputEvent)
        expect(result.statusCode).toEqual(200)
    })
})

async function createOrganisation(): Promise<Organisation> {
    const db = new Database()
    const connection = await db.getConnection()
    const userRepo = connection!.getRepository(User)
    const orgRepo = connection!.getRepository(Organisation)

    const randomEmail = Math.random().toString(36).substring(7) + '@test'
    const user = await userRepo.save(new User('Test', 'User', false, randomEmail, '', 2, []))
    const addressData: AddressData = { city: 'OrgCity', country: 'c', houseNumber: 'h', postalCode: '1', street: 's' }
    const organisationData: OrganisationData = {
        address: addressData,
        email: '@email',
        logoPath: 'lp',
        name: 'n',
        responsibles: []
    }
    const organisation = await orgRepo.save(new Organisation(organisationData, [user]))

    await db.disconnect(connection)

    return organisation
}
