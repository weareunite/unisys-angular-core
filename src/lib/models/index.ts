export interface MenuItem {
    routerLink: object,
    translation: string,
    icon: string,
    permission?: string
}

export interface Contact {
    id: number,
    type: string,
    name: string,
    surname: string,
    company: string,
    street: string,
    zip: string,
    city: string,
    country: Country,
    reg_no: string,
    tax_no: string,
    vat_no: string,
    web: string,
    email: string,
    telephone: string,
    description: string,
    custom_properties: any,
    selected?: boolean | undefined,
    country_id?: number
}

export interface User {
    id: number,
    name: string,
    surname: string,
    username: string,
    email: string,
    password: string,
    password_confirmation: string,
    roles: any[],
    created_at: Date,
    updated_at: Date,
    selected?: boolean | undefined,
    roles_id?: number[],
    active: boolean
}

export interface Tag {
    id: number,
    name: string,
    type: null,
    custom_properties: {
        color: string,
    },
    created_at: null,
    selected?: boolean | undefined,
}

export interface Country {
    id: number,
    capital: string,
    citizenship: string,
    country_code: string,
    currency: string,
    currency_code: string,
    currency_sub_unit: string,
    currency_symbol: string,
    currency_decimals: string,
    full_name: string,
    iso_3166_2: string,
    iso_3166_3: string,
    name: string,
    region_code: string,
    sub_region_code: string,
    eea: string,
    calling_code: string,
    flag: string
}

export interface BankAccount {
    id: number,
    type: string,
    name: string,
    short_name: string,
    iban: string,
    swift: string,
    bank: string,
    selected?: boolean | undefined,
}

export interface Role {
    id: number,
    name: string,
    guard_name: string,
    created_at: null,
    updated_at: null,
    frontend_permissions: null,
    api_permissions: null,
    apiPermissions: null,
    selected?: boolean | undefined,
}

export interface Help {
    id: number;
    name: string;
    key: string;
    body: string;
    selected?: boolean | undefined;
}
