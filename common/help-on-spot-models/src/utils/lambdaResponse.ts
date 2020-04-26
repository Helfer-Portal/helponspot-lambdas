export interface LambdaResponse {
    isBase64Encoded: boolean
    statusCode: number
    body: string
    headers: any
}

export function lambdaResponse(statusCode: number, message: string | object): LambdaResponse {
    const defaultHeader = {
        'Content-Type': 'application/json'
    }

    const body = typeof message === 'string' ? message : JSON.stringify(message)

    return {
        isBase64Encoded: false,
        statusCode,
        body,
        headers: defaultHeader
    }
}
