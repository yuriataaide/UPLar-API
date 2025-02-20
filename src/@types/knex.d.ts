import { Knex } from 'knex'

declare module 'knex/types/tables' {
    export interface Tables {
        users: {
            id: string
            name: string
            email: string
            number_of_contact: number
            profile_type: string
            created_at: string
            session_id?: string
        }

        property: {
            id: string
            name: string
            adress: string
            price: number
            type: string
            category: string
            description: string
            date: number
            created_by: string
            created_at: string
        }
    }
}