import Organisation from "../../../common/help-on-spot-models/dist/entity/Organisation";

require('dotenv').config();
import {Address} from "../../../common/help-on-spot-models/dist";
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

export interface OrganisationData {
    name: string
    address: AddressData
    logoPath: string
    responsibles: string[]
}

interface AddressData {
    street: string
    postalCode: string
    houseNumber: string
    city: string
    country: string
}


export const handler = async (event: LambdaInputEvent): Promise<LambdaResponse> => {
    console.log(JSON.parse(event.body))
    const organisationData: OrganisationData = JSON.parse(event.body)

    const db = new Database();
    const connection = await db.connect();

    try {
        const organisation = new Organisation()
        const addressData = organisationData.address
        organisation.address = new Address(addressData.street, addressData.houseNumber, addressData.postalCode, addressData.city, addressData.country)

        organisation.logoPath = organisationData.logoPath
        organisation.name = organisationData.name
        // TODO: check if users exist
        // organisation.responsibles = organisationData.responsibles
        organisation.createTime = new Date()
        organisation.updateTime = new Date()

        organisation.email = ""

        let saveOrganisation: Organisation = await connection!.manager.save(organisation)
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
