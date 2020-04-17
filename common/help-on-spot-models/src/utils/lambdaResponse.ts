
export interface LambdaResponse {
  isBase64Encoded: boolean
  statusCode: number
  body: string
  headers: any
}

function lambdaResponse (statusCode: number, message: string): LambdaResponse {
  const defaultHeader = {
    'Content-Type': 'application/json'
  }

  return {
    isBase64Encoded: false,
    statusCode,
    body: message,
    headers: defaultHeader
  }
}

export { lambdaResponse };
