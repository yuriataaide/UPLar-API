import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { checkSessionIdExist } from "../middlewares/check-session-id-exist";


export async function properyRoutes(app:FastifyInstance) {
    app.addHook('preHandler', async (request, reply) => {
        console.log(`[${request.method}] ${request.url}`)
    })

    // Create property
    app.post('/', 
        {
            preHandler: [checkSessionIdExist]
        },
        async (request, reply) => {
            const createPropertySchema = z.object({
                name: z.string(),
                description: z.string(),
                adress: z.string(),
                price: z.number(),
                category: z.enum(['apartment', 'house']),
                type: z.enum(['sell', 'rent']),
                date: z.coerce.date()
            })

            const { name, description, adress, price, category, type, date } = createPropertySchema.parse(
                request.body
            )

            await knex('propertys').insert({
                id: randomUUID,
                name,
                description,
                adress,
                price,
                category,
                type,
                date: date.getTime(),
                user_id: request.user?.id
            })

            return reply.status(201).send()
        }
    )

    // List all propertys
    app.get('/',
    {
        preHandler: [checkSessionIdExist]
    },
    async (request, reply) => {

        const propertys = await knex('propertys')
            .where({user_id: request.user?.id})
            .orderBy('date', 'desc')

        return { propertys }
    })

    // List propertys by id
    app.get('/:propertyId', 
    {
        preHandler: [checkSessionIdExist]
    },
    async (request, reply) => {
        const getPropertyParamsSchema = z.object({
            propertyId: z.string().uuid()
        })

        const { propertyId } = getPropertyParamsSchema.parse(request.params)

        const property = await knex('property')
            .where({
                id: propertyId
            })
            .first()

        if(!property) {
            return reply.status(404)
                .send({
                    error: 'Property not found.'
                })
        }

        return reply.send ({ property })
    })

    // Update property
    app.put('/:propertyId', 
        {
            preHandler: [checkSessionIdExist]
        },
        async (request, reply) => {
            const paramsSchema = z.object({
                propertyId: z.string().uuid()
            })

            const { propertyId } = paramsSchema.parse(request.params)

            const updatePropertyBodySchema = z.object({
                name: z.string(),
                description: z.string(),
                adress: z.string(),
                price: z.number(),
                category: z.enum(['apartment', 'house']),
                type: z.enum(['sell', 'rent']),
                date: z.coerce.date()
            })

            const { name, description, adress, price, category, type, date } = updatePropertyBodySchema.parse(request.body)

            const property = await knex('propertys')
                .where({ id: propertyId })
                .first()

            if(!property) {
                return reply.status(404).send({
                    error: 'Property not found.'
                })
            }

            await knex('propertys')
                .where({ id: propertyId })
                .update({
                    name, 
                    description,
                    adress,
                    price,
                    category,
                    type,
                    date
                })

            return reply.status(204).send()
        })

    // Update property
    app.delete('/:properyyId',
        {
            preHandler: [checkSessionIdExist]
        },
        async (request, reply) => {
            const paramsSchema = z.object({
                propertyId: z.string().uuid()
            })

        const { propertyId } = paramsSchema.parse(request.params)

        const property = await knex('propertys')
            .where({ id: propertyId })
            .first()

        if(!property) {
            return reply.send({
                error: 'Property not found.'
            })
        }

        await knex('propertys')
            .where({ id: propertyId })
            .delete()

        return reply.status(204).send()
        }
    )
}

