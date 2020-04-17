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