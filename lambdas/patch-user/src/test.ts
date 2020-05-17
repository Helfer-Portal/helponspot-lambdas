require('dotenv').config()
import { handler, LambdaInputEvent } from './index'
import { Database } from '/opt/nodejs/common/help-on-spot-models/dist/utils/Database'
import { User } from '/opt/nodejs/common/help-on-spot-models/dist'


async function setup(): Promise<User> {
    const connection = await new Database().getConnection()
    const userRepo = connection.getRepository(User)

    const randomEmail = Math.random().toString(36).substring(7) + '@test'
    const user = await userRepo.save(new User(randomEmail, false, [], 'Test', 'User', '', 1))
    await connection.close()
    return user
}

describe('patch user handler',  () => {

    it('Change name', async () => {
        const user = await setup()
        const patchUser = {
            firstName: 'Max',
            lastName: 'Mustermann',
        }
        const requestObject: LambdaInputEvent = {
            body: JSON.stringify(patchUser),
            pathParameters: {
                userId: user.id
            }
        }
        const result = await handler(requestObject)
        expect(result.statusCode).toEqual(200)
        expect(result.body).toContain('Max')

    })

    // it('Change address', async () => {
    //     const user = await setup()
    //     const patchUser = {
    //         address: {
    //             houseNumber: '1',
    //             city: 'München',
    //             street: 'Heinrich-Lübke-Straße',
    //             postalCode: '81737',
    //             country: 'Deutschland'
    //         }
    //     }
    //     const requestObject: LambdaInputEvent = {
    //         body: JSON.stringify(patchUser),
    //         pathParameters: {
    //             userId: user.id
    //         }
    //     }
    //     const result = await handler(requestObject)
    //     expect(result.statusCode).toEqual(200)
    //     expect(result.body).toContain('Heinrich-Lübke-Straße')
    //
    // })
})