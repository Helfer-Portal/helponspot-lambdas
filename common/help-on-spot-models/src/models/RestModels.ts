/**
 * Rest Models, should be in union in what is defined in the API gateway
 */
export interface OrganisationData {
    name: string
    address: AddressData
    logoPath: string
    responsibles: string[]
    email: string
}

export interface AddressData {
    street: string
    postalCode: string
    houseNumber: string
    city: string
    country: string
    coordinates?: number[]
}

export interface RequestData {
    title: string
    description: string
    isActive: boolean
    startDate: string
    endDate: string
    address: AddressData
    qualificationKeys: string[]
}

export interface UserData {
    firstName: string
    lastName: string
    isGPSLocationAllowed: boolean
    email: string
    avatar: string
    travellingDistance: number
    qualifications: string[]
    address: AddressData
}
