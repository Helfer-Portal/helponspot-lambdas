import {PatchError} from "./PatchError";
import {convertEntityToResponseModel} from '/opt/nodejs/common/help-on-spot-models/dist/models/ApiResponseModels'
import {getPointFromGeoservice} from '/opt/nodejs/common/help-on-spot-models/dist/utils/getGeolocation'
import {UserData} from '/opt/nodejs/common/help-on-spot-models/src/models/RestModels'
import {LambdaResponse, lambdaResponse} from '/opt/nodejs/common/help-on-spot-models/dist/utils/lambdaResponse'
import {Address, Connection, Qualification, User, In} from '/opt/nodejs/common/help-on-spot-models/dist'
import {Database} from '/opt/nodejs/common/help-on-spot-models/dist/utils/Database'

export interface LambdaInputEvent {
    pathParameters: any
    body: string
}

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
    const db = new Database()
    const connection = await db.getConnection()
    if (!connection) {
        return lambdaResponse(500, 'No Database connection')
    }

    try {
        const userId = event.pathParameters.userId

        const userRepository = connection.getRepository(User)
        let user: User | undefined
        user = await userRepository.findOne({where: {id: userId}, relations: ['address', 'qualifications']})
        if (!user) {
            throw new PatchError(404, 'User not found!')
        }

        const userPatchData: UserData = JSON.parse(event.body)
        if (userPatchData.email && user.email !== userPatchData.email) {
            throw new PatchError(500, 'Change of e-mail is currently not supported')
        }
        await patchQualifications(userPatchData, user, connection)
        patchPrimitveValues(userPatchData, user);
        await patchAddress(userPatchData, user, connection)

        const savedUser: User = await userRepository.save(user)
        return lambdaResponse(200, JSON.stringify(convertEntityToResponseModel(savedUser)))
    } catch (error) {
        console.log(`Error during lambda execution: ${JSON.stringify(error)}`)
        if (error instanceof PatchError) {
            return lambdaResponse(error.statusCode, error.message)
        } else {
            return lambdaResponse(500, `Unexpected error: '${JSON.stringify(error)}'`)
        }
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
    return addressRepository.findOne({where: {id: addressId}})
}

async function patchQualifications(userPatchData: UserData, user: User, connection: Connection): Promise<void> {
    if (userPatchData.qualifications && userPatchData.qualifications.length > 0) {
        const qualifications = await findQualifications(userPatchData.qualifications, connection)
        if (qualifications.length !== userPatchData.qualifications.length) {
            throw new PatchError(400, 'Some qualifications are not valid!')
        }
        user.qualifications = qualifications
    }
}

async function patchAddress(userPatchData: UserData, user: User, connection: Connection) {
    if (userPatchData.address) {
        let coordinates
        try {
            coordinates = await getPointFromGeoservice(userPatchData.address)
        } catch (e) {
            console.log(`Error during lambda execution: ${e.message}`)
            throw new PatchError(500, e.message)
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
}

function patchPrimitveValues(userPatchData: UserData, user: User) {
    if (userPatchData.firstName) {
        user.firstName = userPatchData.firstName
    }
    if (userPatchData.lastName) {
        user.lastName = userPatchData.lastName
    }

    if (userPatchData.travellingDistance) {
        user.travellingDistance = userPatchData.travellingDistance
    }
    if (userPatchData.isGPSLocationAllowed !== undefined) {
        user.isGPSLocationAllowed = userPatchData.isGPSLocationAllowed
    }
    if (userPatchData.avatar) {
        user.avatar = userPatchData.avatar
    }
}
