import {Qualification, User} from "../../../common/help-on-spot-models/dist";

require('dotenv').config();

import Request from "../../../common/help-on-spot-models/dist/entity/Request";
import {Database} from "../../../common/help-on-spot-models/dist/utils/Database";
import {LambdaResponse, lambdaResponse} from "../../../common/help-on-spot-models/dist/utils/lambdaResponse";

export interface LambdaInputEvent {
    pathParameters: {
        userId: string,
        radius?: string,
        requestType?: string,
        location?: { lat: number, long: number }
    }
}

function matchesUserQuals(request: Request, requestedQualifications: Qualification[]): boolean {
    const userKeys = requestedQualifications.map(r => r.key)

    return request.qualifications!.every(rq => userKeys.includes(rq.key))
}

export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
    const userId = event.pathParameters.userId;
    const db = new Database();
    const connection = await db.getConnection();
    try {
        console.log('looking for ' + userId)
        const user = await connection.getRepository(User).findOne({
            where: {id: userId},
            relations: ['qualifications', 'address']
        })
        if (!user) {
            return lambdaResponse(400, 'Give User does not exist')
        }
        const requestedQualifications: Qualification[]  = user.qualifications!
        const requestedCity = user.address!.city

        const requestRepository = connection.getRepository(Request)
        const matchedRequests = await requestRepository.createQueryBuilder("request")
            .leftJoinAndSelect("request.address", "address")
            .leftJoinAndSelect("request.qualifications", "qualifications")
            .where("address.city = :city", {city: requestedCity})
            .getMany()

        console.log('Found ' + matchedRequests.length + " matches")
        const fileterd = matchedRequests.filter(request => matchesUserQuals(request, requestedQualifications))
        console.log(`Remain ${fileterd.length}`)
        console.log(`Remain ${JSON.stringify(fileterd, null, 2)}`)
        // const user: User | undefined = await requestRepository.findOne({ where: { id: userId }, relations: ['address', 'qualifications'] });

        if (!matchedRequests) {
            return lambdaResponse(404, "No Requests match the given query");
        }
        return lambdaResponse(200, fileterd);
    } catch (e) {
        console.log(`Error during lambda execution: ${e}`)
        return lambdaResponse(500, JSON.stringify(e));
    } finally {
        await db.disconnect(connection)
    }
}
