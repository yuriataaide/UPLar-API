import 'fastify'

declare module 'fastify' {
    export interface FastifyRequest {
        user?: {
            id: string
            session_id: string
            name: string
            email: string
            number_of_contact: number
            profile_type: string
            created_at: string
            updated_at: string
        }
    }
}