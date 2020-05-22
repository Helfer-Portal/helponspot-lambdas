require('dotenv').config()

import { handler, LambdaInputEvent } from './index'
import { Database } from '/opt/nodejs/common/help-on-spot-models/dist/utils/Database'
import { Address, Qualification, User } from '/opt/nodejs/common/help-on-spot-models/dist'
import { AddressData } from '/opt/nodejs/common/help-on-spot-models/dist/models/RestModels'

describe("GET users", () => {
    it("return matching user", async () => {
        const connection = await new Database().getConnection()
        const userRepo = connection!.getRepository(User)
        const adressData: AddressData = {
            country: 'Germany',
            city: 'Nuremberg',
            postalCode: '1',
            houseNumber: '1',
            street: 'Staße',
            // Nuremberg
            coordinates: [49.443223, 11.076612]
        }
        const address = await connection.getRepository(Address).save(new Address(adressData))
        const qualifications = await connection.getRepository(Qualification).find()
        const randomEmail = Math.random().toString(36).substring(7) + '@test'
        const user1 = await userRepo.save(new User(randomEmail, false, qualifications, 'Test', 'User', '', 1))
        user1.address = address
        await userRepo.save(user1)



        const input: LambdaInputEvent = {
            queryStringParameters: {
                qualifications: [],
                // Munich
                location: [48.122164, 11.535313],
                maxDistanceInMeter: 200 * 1000
            }
        }
        const lambdaResponse = await handler(input)
        const result = JSON.parse(lambdaResponse.body)
        expect(result.length).toEqual(1)



        const input2: LambdaInputEvent = {
            queryStringParameters: {
                qualifications: [],
                // Munich
                location: [48.122164, 11.535313],
                maxDistanceInMeter: 100 * 1000
            }
        }
        const lambdaRepsonse2 = await handler(input2)
        const result2 = JSON.parse(lambdaRepsonse2.body)
        expect(result2.length).toEqual(0)



        const input3: LambdaInputEvent = {
            queryStringParameters: {
                qualifications: ['invalid'],
                // Munich
                location: [48.122164, 11.535313],
                maxDistanceInMeter: 200 * 1000
            }
        }
        const lambdaRepsonse3 = await handler(input3)
        const result3 = JSON.parse(lambdaRepsonse2.body)
        expect(result3.length).toEqual(0)
    })
})
