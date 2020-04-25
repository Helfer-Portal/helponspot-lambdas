import { AddressData } from '../models/RestModels'
import { Config } from 'aws-sdk'
import Lambda from 'aws-sdk/clients/lambda'

export async function getPointFromGeoservice(address: AddressData): Promise<number[]> {
    // credentials are only needed for local setup
    const awsConfig = new Config({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_REGION
    })
    const lambda = new Lambda(awsConfig)
    const params = {
        FunctionName: process.env.GEOSERVICE_LAMBDA_NAME as string,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({ body: JSON.stringify(address) })
    }
    const data = await lambda.invoke(params).promise()
    const geoserviceResponse = JSON.parse(data.Payload as string)
    const geoserviceResponseBody = JSON.parse(geoserviceResponse.body)
    if (!geoserviceResponseBody.lat) {
        throw Error('Location for address not found!')
    }
    const latlngData = [geoserviceResponseBody.lat, geoserviceResponseBody.lng]
    console.log(latlngData)

    return latlngData
}
