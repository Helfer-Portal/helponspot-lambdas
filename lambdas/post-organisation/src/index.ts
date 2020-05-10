require('dotenv').config()

import { getPointFromGeoservice } from '/opt/nodejs/common/help-on-spot-models/dist/utils/getGeolocation'
import { LambdaResponse, lambdaResponse } from '/opt/nodejs/common/help-on-spot-models/dist/utils/lambdaResponse'
import { OrganisationData } from '/opt/nodejs/common/help-on-spot-models/src/models/RestModels'
import Organisation from '/opt/nodejs/common/help-on-spot-models/dist/entity/Organisation'
import { User } from '/opt/nodejs/common/help-on-spot-models/dist'
import { Database } from '/opt/nodejs/common/help-on-spot-models/dist/utils/Database'
import { convertEntityToResponseModel } from '/opt/nodejs/common/help-on-spot-models/dist/models/ApiResponseModels'

export interface LambdaInputEvent {
    body: string
}

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
    console.log(JSON.parse(event.body))
    const organisationData: OrganisationData = JSON.parse(event.body)

    const db = new Database()
    const connection = await db.getConnection()
    if (!connection) {
        return lambdaResponse(500, 'No Database connection')
    }

    let coordinates
    try {
        coordinates = await getPointFromGeoservice(organisationData.address)
    } catch (e) {
        await db.disconnect(connection)
        console.log(`Error during lambda execution: ${e.message}`)
        return lambdaResponse(400, { message: e.message })
    }

    try {
        const userRepository = connection.getRepository(User)
        const users: User[] = await userRepository
            .createQueryBuilder('user')
            .where('user.id IN (:...res)', { res: organisationData.responsibles })
            .getMany()
        console.log(`Found ${users.length} valid users of ${organisationData.responsibles.length} requested`)
        const organisation = new Organisation(organisationData, users)
        organisation.address!.point = {
            type: 'Point',
            coordinates
        }
        const persistedOrganisation: Organisation = await connection.manager.save(organisation)
        console.log(`Persisted new Organisation: ${JSON.stringify(persistedOrganisation)}`)
        return lambdaResponse(200, JSON.stringify(convertEntityToResponseModel(persistedOrganisation)))
    } catch (e) {
        console.log(`Error during lambda execution:\n ${JSON.stringify(e)}`)
        return lambdaResponse(500, JSON.stringify(e))
    } finally {
        await db.disconnect(connection)
    }
}
