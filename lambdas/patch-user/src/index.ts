import { convertEntityToResponseModel } from '../../../common/help-on-spot-models/dist/models/ApiResponseModels'

require('dotenv').config()

import { getPointFromGeoservice } from '../../../common/help-on-spot-models/dist/utils/getGeolocation'
import { UserData } from '../../../common/help-on-spot-models/src/models/RestModels'
import { LambdaResponse, lambdaResponse } from '../../../common/help-on-spot-models/dist/utils/lambdaResponse'
import { Address, Connection, Qualification, User, In } from '../../../common/help-on-spot-models/dist'
import { Database } from '../../../common/help-on-spot-models/dist/utils/Database'

export interface LambdaInputEvent {
    pathParameters: any
    body: string
}

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
    const userId = event.pathParameters.userId
    const db = new Database()
    const connection = await db.getConnection()

    if (!connection) {
        return lambdaResponse(500, 'No Database connection')
    }

    const userRepository = connection.getRepository(User)
    let user: User | undefined
    try {
        user = await userRepository.findOne({ where: { id: userId }, relations: ['address', 'qualifications'] })
        if (!user) {
            await db.disconnect(connection)
            return lambdaResponse(404, 'User not found!')
        }
    } catch (e) {
        await db.disconnect(connection)
        return lambdaResponse(500, JSON.stringify(e))
    }

    const userPatchData: UserData = JSON.parse(event.body)

    if (userPatchData.qualifications && userPatchData.qualifications.length > 0) {
        const qualifications = await findQualifications(userPatchData.qualifications, connection)
        if (qualifications.length !== userPatchData.qualifications.length) {
            await db.disconnect(connection)
            return lambdaResponse(400, 'Some qualifications are not valid!')
        }
        user.qualifications = qualifications
    }

    user.firstName = userPatchData.firstName
    user.lastName = userPatchData.lastName
    user.email = userPatchData.email

    if (userPatchData.travellingDistance) {
        user.travellingDistance = userPatchData.travellingDistance
    }

    if (userPatchData.isGPSLocationAllowed !== undefined) {
        user.isGPSLocationAllowed = userPatchData.isGPSLocationAllowed
    }
    if (userPatchData.avatar) {
        user.avatar = userPatchData.avatar
    }

    if (userPatchData.address) {
        let coordinates
        try {
            coordinates = await getPointFromGeoservice(userPatchData.address)
        } catch (e) {
            console.log(`Error during lambda execution: ${e.message}`)
            await db.disconnect(connection)
            return lambdaResponse(400, { message: e.message })
        }
        if (user.address && user.address.id) {
            const oldAddress = await findAddress(user.address.id, connection)
            oldAddress!.city = userPatchData.address.city
            oldAddress!.postalCode = userPatchData.address.postalCode
            oldAddress!.country = userPatchData.address.country
            oldAddress!.houseNumber = userPatchData.address.houseNumber
            oldAddress!.street = userPatchData.address.street
            user.address = oldAddress
        } else {
            user.address = new Address(userPatchData.address)
        }
        user!.address!.point = {
            type: 'Point',
            coordinates
        }
    }

    try {
        const savedUser: User = await userRepository.save(user)
        return lambdaResponse(200, JSON.stringify(convertEntityToResponseModel(savedUser)))
    } catch (e) {
        console.log(`Error during lambda execution: ${JSON.stringify(e)}`)
        return lambdaResponse(500, JSON.stringify(e))
    } finally {
        await db.disconnect(connection)
    }
}

async function findQualifications(qualifications: string[], connection: Connection): Promise<Qualification[]> {
    const qualificationRepository = connection.getRepository(Qualification)
    return qualificationRepository.find({
        key: In(qualifications)
    })
}

async function findAddress(addressId: string, connection: Connection): Promise<Address | undefined> {
    const addressRepository = connection.getRepository(Address)
    return addressRepository.findOne({ where: { id: addressId } })
}
