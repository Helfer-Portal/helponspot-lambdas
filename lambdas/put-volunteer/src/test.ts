import { handler, LambdaInputEvent } from './index'
import { AddressData, OrganisationData, RequestData } from '../../../common/help-on-spot-models/src/models/RestModels'

import User from '../../../common/help-on-spot-models/dist/entity/User'
import Request from '../../../common/help-on-spot-models/dist/entity/Request'
import Organisation from '../../../common/help-on-spot-models/dist/entity/Organisation'
import { Database } from '../../../common/help-on-spot-models/dist/utils/Database'
;(async function () {
    const db = await new Database()
    const connection = await db.getConnection()
    const userRepo = connection!.getRepository(User)
    const orgRepo = connection!.getRepository(Organisation)

    const randomEmail = Math.random().toString(36).substring(7) + '@test'
    const user = await userRepo.save(new User('Test', 'User', false, randomEmail, '', 1, []))
    const address: AddressData = { city: 'c', country: 'c', houseNumber: 'h', postalCode: '1', street: 's' }
    const orgData: OrganisationData = { address: address, email: '@lo', logoPath: 'l', name: 'o', responsibles: [] }
    const org = await orgRepo.save(new Organisation(orgData, [user]))

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
    const request = await connection!.getRepository(Request).save(new Request(requestData, org, []))
    await connection!.close()

    {
        const requestObject: LambdaInputEvent = {
            body: JSON.stringify({
                response: 'accepted'
            }),
            path: `/requests/${request.id}/volunteers/${user.id}`,
            pathParameters: {
                requestId: request.id,
                userId: user.id
            }
        }
        const result = await handler(requestObject)
    }

    {
        const requestObject: LambdaInputEvent = {
            body: JSON.stringify({
                response: 'declined'
            }),
            path: `/requests/${request.id}/volunteers/${user.id}`,
            pathParameters: {
                requestId: request.id,
                userId: user.id
            }
        }
        const result = await handler(requestObject)
    }
})()
