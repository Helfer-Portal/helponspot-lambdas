import {AddressData} from "../models/RestModels";
import {Config} from "aws-sdk";
import Lambda from "aws-sdk/clients/lambda";

require('dotenv').config();

export async function getPointFromGeoservice(address: AddressData): Promise<number[]> {
  const awsConfig = new Config({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
  })
  const lambda = new Lambda(awsConfig);
  const params = {
    FunctionName: 'HoS-geolocation-dev',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({ "body": JSON.stringify(address) }),
  };
  let latlngData: number[];
  const data = await lambda.invoke(params).promise();
  const geoserviceResponse = JSON.parse(data.Payload as string);
  const geoserviceResponseBody = JSON.parse(geoserviceResponse.body);
  latlngData = [geoserviceResponseBody.lat, geoserviceResponseBody.lng];
  console.log(latlngData);

  if (latlngData.length === 0) {
    throw Error("Geoservice data could not be fetched!");
  }
  return latlngData;
}
