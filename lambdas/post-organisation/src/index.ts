import {getPointFromGeoservice} from "../../../common/help-on-spot-models/dist/utils/getGeolocation";

require('dotenv').config();

import {LambdaResponse, lambdaResponse} from "../../../common/help-on-spot-models/dist/utils/lambdaResponse";
import {OrganisationData} from "../../../common/help-on-spot-models/src/models/RestModels";
import Organisation from "../../../common/help-on-spot-models/dist/entity/Organisation";
import {User} from "../../../common/help-on-spot-models/dist";
import {Database} from "../../../common/help-on-spot-models/dist/utils/Database";
import {convertEntityToResponseModel} from "../../../common/help-on-spot-models/dist/models/ApiResponseModels";

export interface LambdaInputEvent {
    body: string
}

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
    console.log(JSON.parse(event.body))
    const organisationData: OrganisationData = JSON.parse(event.body)

    const db = new Database();
    const connection = await db.getConnection();
    if (!connection) {
        return lambdaResponse(500, 'No Database connection');
    }

    try {
        const userRepository = connection.getRepository(User)
        const users: User[] = await userRepository.createQueryBuilder("user").where("user.id IN (:...res)", { res: organisationData.responsibles }).getMany()
        console.log(`Found ${users.length} valid users of ${organisationData.responsibles.length} requested`)
        const organisation = new Organisation(organisationData, users)
        organisation.address!.point =  {
            type: "Point",
            coordinates: await getPointFromGeoservice(organisationData.address)
        };
        let persistedOrganisation: Organisation = await connection.manager.save(organisation)
        console.log(`Persisted new Organisation: ${JSON.stringify(persistedOrganisation)}`)
        return lambdaResponse(200, JSON.stringify(convertEntityToResponseModel(persistedOrganisation)));
    } catch (e) {
        console.log(`Error during lambda execution:\n ${JSON.stringify(e)}`)
        return lambdaResponse(500, JSON.stringify(e));
    } finally {
        await db.disconnect(connection);
    }
}
