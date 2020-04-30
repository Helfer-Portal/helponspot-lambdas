require('dotenv').config()

import { User, Repository } from '/opt/nodejs/common/help-on-spot-models/dist'
import { Database } from '/opt/nodejs/common/help-on-spot-models/dist/utils/Database'

export const handler = async (event: any, context: any, callback: any) => {
    console.log(event)

    const email = event.request.userAttributes.email
    if (!email) {
        callback('no email was found in the user attributes')
        return
    }

    const db = new Database()
    const connection = await db.getConnection()

    if (!connection) {
        callback('no database connection')
        return
    }

    const userRepository = connection!.getRepository(User)

    if (await findByEmail(email, userRepository)) {
        console.log(`A user with email ${email} already exists!`)
        await db.disconnect(connection)
        callback('email is already taken')
        return
    }

    const user = new User(email, false, [], '','', '', 1000)

    try {
        await userRepository.save(user)
        callback(null, event)
    } catch (e) {
        console.log(`Error during lambda execution: ${JSON.stringify(e)}`)
        callback('user cannot be saved')
    } finally {
        await db.disconnect(connection)
    }
}

async function findByEmail(email: string, userRepository: Repository<User>): Promise<User | undefined> {
    return userRepository.findOne({
        where: { email: email }
    })
}
