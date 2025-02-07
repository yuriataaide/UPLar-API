import { Knex } from 'knex'

declare module 'knex/types/tables' {
    export interface Tables {
        users: {
            id: string
            name: string
            email: string
            profile: string
            created_at: string
            session_id?: string
        }
    }
}