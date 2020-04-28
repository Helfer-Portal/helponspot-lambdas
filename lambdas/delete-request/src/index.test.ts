import Request from '/opt/nodejs/common/help-on-spot-models/dist/entity/Request'

require('dotenv').config()
import { handler, LambdaInputEvent } from './index'
import { OrganisationData, AddressData } from '/opt/nodejs/common/help-on-spot-models/dist/models/RestModels'
import { Database } from '/opt/nodejs/common/help-on-spot-models/dist/utils/Database'
import User from '/opt/nodejs/common/help-on-spot-models/dist/entity/User'
import Organisation from '/opt/nodejs/common/help-on-spot-models/dist/entity/Organisation'
import { RequestData } from '/opt/nodejs/common/help-on-spot-models/dist/models/RestModels'
import exp = require('constants')

describe('delete user handler', () => {
    it('should return status 500 when user id is invalid', async () => {
        const inputEvent: LambdaInputEvent = {
            pathParameters: {
                requestId: 'invalid-id'
            }
        }

        const result = await handler(inputEvent)
        expect(result.statusCode).toEqual(500)
    })

    it('should return status 200', async () => {
        const request: Request = await createRequest()
        const inputEvent: LambdaInputEvent = {
            pathParameters: {
                requestId: request.id!
            }
        }
        const result = await handler(inputEvent)
        expect(result.statusCode).toEqual(200)
    })
})

async function createRequest(): Promise<Request> {
    const db = new Database()
    const connection = await db.getConnection()
    const userRepo = connection!.getRepository(User)
    const orgRepo = connection!.getRepository(Organisation)

    const randomEmail = Math.random().toString(36).substring(7) + '@test'
    const user = await userRepo.save(new User(randomEmail, false, [], 'Test', 'User', "", 1))
    const addressData: AddressData = { city: 'OrgCity', country: 'c', houseNumber: 'h', postalCode: '1', street: 's' }
    const organisationData: OrganisationData = {
        address: addressData,
        email: '@email',
        logoPath: 'lp',
        name: 'n',
        responsibles: []
    }
    const organisation = await orgRepo.save(new Organisation(organisationData, [user]))

    const requestData: RequestData = {
        title: 'huhu',
        address: {
            street: 'string',
            postalCode: 'string',
            houseNumber: 'string',
            city: 'string',
            country: 'string'
        },
        description: 'desc',
        endDate: '2004-07-11',
        startDate: '2004-07-12',
        isActive: false,
        qualificationKeys: ['physicallyFit']
    }
    const request = new Request(requestData, organisation, undefined)
    await connection.getRepository(Request).save(request)
    await db.disconnect(connection)
    return request
}
