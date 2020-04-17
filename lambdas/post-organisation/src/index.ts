require('dotenv').config();

import {OrganisationData} from "../../../common/help-on-spot-models/src/models/RestModels";
import Organisation from "../../../common/help-on-spot-models/dist/entity/Organisation";
import {User} from "../../../common/help-on-spot-models/dist";
import {Database} from "../../../common/help-on-spot-models/dist/utils/Database";


interface LambdaResponse {
    isBase64Encoded: boolean
    statusCode: number
    body: string
    headers: any
}

export interface LambdaInputEvent {
    body: string
}

const defaultHeader = {
    'Content-Type': 'application/json'
}


export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
    console.log(JSON.parse(event.body))
    const organisationData: OrganisationData = JSON.parse(event.body)

    const db = new Database();
    const connection = await db.connect();
    if (!connection) {
        throw Error("Unable to Connect to the database")
    }

    try {
        const userRepository = connection.getRepository(User)
        const users: User[] = await userRepository.createQueryBuilder("user").where("user.id IN (:...res)", { res: organisationData.responsibles }).getMany()
        console.log(`Found ${users.length} valid users of ${organisationData.responsibles.length} requested`)
        const organisation = new Organisation(organisationData, users)
        let persistedOrganisation: Organisation = await connection.manager.save(organisation)
        console.log(`Persisted new Organisation: ${JSON.stringify(persistedOrganisation)}`)
        return {
            isBase64Encoded: false,
            statusCode: 200,
            body: JSON.stringify(persistedOrganisation),
            headers: defaultHeader
        }
    } catch (e) {
        console.log(`Error during lambda execution:\n ${JSON.stringify(e)}`)
        return {
            isBase64Encoded: false,
            statusCode: 500,
            body: JSON.stringify(e),
            headers: defaultHeader
        }
    } finally {
        await db.disconnect()
    }
}
