require('dotenv').config()

import { handler, LambdaInputEvent } from './index'
import { Database } from '/opt/nodejs/common/help-on-spot-models/dist/utils/Database'
import { Address, Qualification, User } from '/opt/nodejs/common/help-on-spot-models/dist'
import { AddressData, OrganisationData } from '/opt/nodejs/common/help-on-spot-models/dist/models/RestModels'
import Request from '/opt/nodejs/common/help-on-spot-models/dist/entity/Request'
import Organisation from '/opt/nodejs/common/help-on-spot-models/dist/entity/Organisation'
import { requestData1, requestData2, requestData3, userAddresData } from './testData'

describe("get qualifications handler", () => {
    it("should return status 200", async () => {
        const connection = await new Database().getConnection()
        const userRepo = connection!.getRepository(User)
        const orgRepo = connection!.getRepository(Organisation)
        const adata = new Address(userAddresData)
        const address = await connection.getRepository(Address).save(adata)

        const qualifications = await connection.getRepository(Qualification).find()
        const randomEmail = Math.random().toString(36).substring(7) + '@test'
        const user = new User(
            randomEmail,
            false,
            qualifications.filter((q) => q.key === 'physicallyFit'),
            'Test',
            'User',
            '',
            1600
        )
        user.address = address
        await userRepo.save(user)
        const addressData: AddressData = { city: 'c', country: 'c', houseNumber: 'h', postalCode: '1', street: 's' }
        const organ: OrganisationData = { address: addressData, email: '@lo', logoPath: 'l', name: 'o', responsibles: [] }
        const organisation = await orgRepo.save(new Organisation(organ, [user]))

        await connection.getRepository(Request).save(
            new Request(
                requestData1,
                organisation,
                qualifications.filter((q) => q.key === 'medicalEducation')
            )
        )
        await connection.getRepository(Request).save(
            new Request(
                requestData2,
                organisation,
                qualifications.filter((q) => q.key === 'physicallyFit')
            )
        )
        await connection.getRepository(Request).save(
            new Request(
                requestData3,
                organisation,
                qualifications.filter((q) => q.key === 'physicallyFit')
            )
        )
        await connection.close()

        const requestObject: LambdaInputEvent = {
            pathParameters: {
                userId: user.id!
            }
        }

        const result = await handler(requestObject)
        expect(result.statusCode).toEqual(200)

        const requestObjectWithRadius: LambdaInputEvent = {
            pathParameters: {
                userId: user.id!
            },
            queryStringParameters: {
                radius: 3000
            }
        }

        const resultWithRadius = await handler(requestObjectWithRadius)
        expect(resultWithRadius.statusCode).toEqual(200)
    })
})
