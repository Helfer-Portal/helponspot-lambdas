import {OrganisationData} from "../../../common/help-on-spot-models/src/models/RestModels";

require('dotenv').config();
import Organisation from "../../../common/help-on-spot-models/dist/entity/Organisation";
import {In} from "typeorm";

import {Address, User} from "../../../common/help-on-spot-models/dist";
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
        throw Error("ba")
    }

    try {



        const userRepository = connection.getRepository(User)
        const realUsers: User[] = await userRepository.createQueryBuilder("user").where("user.id IN (:...res)", { res: organisationData.responsibles }).execute()
        const organisation = new Organisation(organisationData, realUsers)

        console.log(`Found ${realUsers.length} users`)
        console.log(JSON.stringify(realUsers) + "\n")

        let saveOrganisation: Organisation = await connection.manager.save(organisation)




        console.log('Persisted new Organisation')



        return {
            isBase64Encoded: false,
            statusCode: 200,
            body: JSON.stringify(saveOrganisation),
            headers: defaultHeader
        }
    } catch (e) {
        console.log(`Error during lambda execution: ${JSON.stringify(e)}`)
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
