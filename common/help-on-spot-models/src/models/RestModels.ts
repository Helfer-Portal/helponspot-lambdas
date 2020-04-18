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
}


export interface RequestData {
    title: string,
    description: string
    isActive: boolean
    startDate: string
    endDate: string
    address: AddressData
    qualifiactionKeys: string[]
}