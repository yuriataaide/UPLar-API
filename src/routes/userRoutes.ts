import { FastifyInstance } from "fastify"
import { knex } from "../database"
import { z } from 'zod'
import { randomUUID } from "node:crypto"
import { checkSessionIdExist } from "../middlewares/check-session-id-exist"

export async function userRoutes(app:FastifyInstance) {
    
    app.addHook('preHandler', async (request, reply) => {
        console.log(`[${request.method}] ${request.url}`)
    })

    // Create user
    app.post('/signup', async (request, reply) => {
        const createUserBodySchema = z.object({
            name: z.string(),
            email: z.string(),
            contact: z.number(),
            profile: z.enum(['owner', 'renter']),

        })

        let sessionId = request.cookies.sessionId
        
        if(!sessionId) {
            console.log('No sessionId found, generating a new one')
            sessionId = randomUUID()

            reply.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 *7 // 7 days
            })
        }
        
        const { name, email, profile, contact } = createUserBodySchema.parse(
            request.body
        )

        const userByEmail = await knex('users')
            .where({ email })
            .first()

        await knex('users')
            .insert({
                id: randomUUID(),
                name,
                email,
                number_of_contact: contact,
                profile_type: profile === 'owner' ? profile : 'renter',
                session_id: sessionId
            })

        return reply.status(201).send()
    })

    // List all users
    app.get('/', async (request, reply) => {
            const { sessionId } = request.cookies
    
            const users = await knex('users')
                .where('session_id', sessionId)
                .select()
    
            return { users }
        })
    
    // List user by ID
    app.get('/:userId', 
    async (request) => {
        const getUsersParamsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = getUsersParamsSchema.parse(request.params)

        const user = await knex ('users')
            .where({id})
            .first()

            return { user }
    })

    // Update user
    app.put('/:userId', async (request, reply) => {
        const paramsSchema = z.object({ userId: z.string().uuid() })

        const { userId } = paramsSchema.parse(request.params)

        const updateUserBodySchema = z.object({
            name: z.string(),
            email: z.string(),
            contact: z.number(),
            profile: z.enum(['owner', 'renter'])
        })

        const { name, email, contact, profile } = updateUserBodySchema.parse(request.body)

        const user = await knex('users')
            .where({ id: userId })
            .first()

        if(!user) {
            return reply.send({
                error: 'User not found'
            })
        }

        await knex('users')
            .where({ id: userId })
            .update({
                name,
                email,
                number_of_contact: contact,
                profile_type: profile
            })
    })

    // Delete user
    app.delete('/:userId', async (request, reply) => {
        const paramsSchema = z.object({ userId: z.string().uuid() })

        const { userId } = paramsSchema.parse(request.params)

        const deletedUser = await knex('users')
            .where({ id: userId })
            .first()

        if(!deletedUser) { 
            return reply.send({
                error: 'User not found'
            })
        }

        await knex('users')
            .where({ id: userId })
            .delete()

        return reply.status(204).send()
    })
}
