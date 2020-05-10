import { handler, LambdaInputEvent } from './index'
import { Database } from '/opt/nodejs/common/help-on-spot-models/dist/utils/Database'
import { User } from '/opt/nodejs/common/help-on-spot-models/dist'

describe('delete organisation handler', () => {
    it('should return status 200', async () => {
        const connection = await new Database().getConnection()
        const userRepo = connection.getRepository(User)

        const randomEmail = Math.random().toString(36).substring(7) + '@test'
        const user = await userRepo.save(new User(randomEmail, false, [], 'Test', 'User', '', 1))
        await connection.close()

        const patchUser = {
            firstName: 'Max neu',
            lastName: 'Mustermann neu',
            isGPSLocationAllowed: true,
            email: 'test@neu123.de',
            avatar: 'new_picture.jpg',
            travellingDistance: 17,
            address: {
                houseNumber: '1',
                city: 'München',
                street: 'Heinrich-Lübke-Straße',
                postalCode: '81737',
                country: 'Deutschland'
            },
            qualifications: ['medicalEducation', 'driversLicence']
        }
        const requestObject: LambdaInputEvent = {
            body: JSON.stringify(patchUser),
            pathParameters: {
                userId: user.id
            }
        }
        const result = await handler(requestObject)
        expect(result.statusCode).toEqual(200)
    })
})