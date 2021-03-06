import { getPointFromGeoservice } from '/opt/nodejs/common/help-on-spot-models/dist/utils/getGeolocation'

require('dotenv').config()

import { LambdaResponse, lambdaResponse } from '/opt/nodejs/common/help-on-spot-models/dist/utils/lambdaResponse'
import { RequestData } from '/opt/nodejs/common/help-on-spot-models/dist/models/RestModels'
import { Database } from '/opt/nodejs/common/help-on-spot-models/dist/utils/Database'
import { Connection, In, Qualification } from '/opt/nodejs/common/help-on-spot-models/dist/index'
import Organisation from '/opt/nodejs/common/help-on-spot-models/dist/entity/Organisation'
import Request from '/opt/nodejs/common/help-on-spot-models/dist/entity/Request'
import { convertEntityToResponseModel } from '/opt/nodejs/common/help-on-spot-models/dist/models/ApiResponseModels'

export interface LambdaInputEvent {
    body: string
    path: string
    pathParameters: any
}

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
    console.log(JSON.stringify(event))
    const requestData: RequestData = JSON.parse(event.body)

    const db = new Database()
    const connection = await db.getConnection()

    let coordinates
    try {
        coordinates = await getPointFromGeoservice(requestData.address)
    } catch (e) {
        console.log(`Error during lambda execution: ${e.message}`)
        return lambdaResponse(400, { message: e.message })
    }

    try {
        const organisation: Organisation | undefined = await findOrganisation(event, connection!)
        const qualifications: Qualification[] | undefined = await findQualifications(
            requestData.qualificationKeys,
            connection!
        )
        const request = new Request(requestData, organisation, qualifications)
        request.address!.point = {
            type: 'Point',
            coordinates
        }
        const savedRequest = await connection!.getRepository(Request).save(request)
        return lambdaResponse(200, JSON.stringify(convertEntityToResponseModel(savedRequest)))
    } catch (e) {
        console.log(`Error during lambda execution:\n ${e}`)
        return lambdaResponse(500, JSON.stringify(e))
    } finally {
        await db.disconnect(connection)
    }
}

async function findOrganisation(event: LambdaInputEvent, connection: Connection): Promise<Organisation> {
    const organisationId = event.pathParameters.organisationId
    if (organisationId) {
        console.log(`for OrgId: ${organisationId}`)
        const organisation = await connection.getRepository(Organisation).findOne({ id: organisationId })
        if (!organisation) {
            throw Error(`Could not find Organisation for id ${organisationId}`)
        }
        console.log(`found org: ${JSON.stringify(organisation)}`)

        return organisation
    } else {
        throw Error(`Could not determine OrganisationId from path ${JSON.stringify(event)}`)
    }
}

async function findQualifications(qualifiactionKeys: string[], connection: Connection) {
    if (qualifiactionKeys && qualifiactionKeys.length > 0) {
        const qualificaitons = await connection.getRepository(Qualification).find({ key: In(qualifiactionKeys) })
        console.log(`Found '${qualificaitons.length}' qualifications for '${qualifiactionKeys.length}' key`)
        return qualificaitons
    } else {
        return undefined
    }
}
