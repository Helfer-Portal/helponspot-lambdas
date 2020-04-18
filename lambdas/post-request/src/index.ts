import {LambdaResponse, lambdaResponse} from "../../../common/help-on-spot-models/dist/utils/lambdaResponse";

require('dotenv').config();
import {RequestData} from "../../../common/help-on-spot-models/dist/models/RestModels";
import {Database} from "../../../common/help-on-spot-models/dist/utils/Database";
import {Connection, In, Qualification} from "../../../common/help-on-spot-models/dist/index";
import Organisation from "../../../common/help-on-spot-models/dist/entity/Organisation";
import Request from "../../../common/help-on-spot-models/dist/entity/Request";


export interface LambdaInputEvent {
    body: string
    path: string
}


export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
    console.log(JSON.stringify(event))
    console.log(JSON.parse(event.body))
    const requestData: RequestData = JSON.parse(event.body)

    const db = new Database();
    try {
        const connection = await db.connect();
        const organisation: Organisation | undefined = await findOrganisation(event, connection!)
        const qualifications: Qualification[] | undefined = await findQualifications(requestData.qualifiactionKeys, connection!)
        const request = new Request(requestData, organisation, qualifications)
        const savedRequest = await connection!.getRepository(Request).save(request)
        return lambdaResponse(200, JSON.stringify(savedRequest))
    } catch (e) {
        console.log(`Error during lambda execution:\n ${e}`)
        return lambdaResponse(500, JSON.stringify(e))
    } finally {
        await db.disconnect()
    }
}

async function findOrganisation(event: LambdaInputEvent, connection: Connection): Promise<Organisation> {
    const orgId = event.path.split('/')[2]
    if (orgId) {
        console.log(`for OrgId: ${orgId}`)
        const organisation = await connection.getRepository(Organisation).findOne({id: orgId})
        if (!organisation) {
            throw Error(`Could not find Organisation for id ${orgId}`)
        }
        console.log(`found org: ${JSON.stringify(organisation)}`)

        return organisation
    } else {
        throw Error(`Could not determine OrganisationId from path ${JSON.stringify(event)}`)
    }
}

async function findQualifications(qualifiactionKeys: string[], connection: Connection) {
    if (qualifiactionKeys && qualifiactionKeys.length > 0) {
        const qualificaitons = await connection.getRepository(Qualification).find({key: In(qualifiactionKeys)})
        console.log(`Found '${qualificaitons.length}' qualifications for '${qualifiactionKeys.length}' key`)
        return qualificaitons
    }
    else {
        return undefined
    }
}
