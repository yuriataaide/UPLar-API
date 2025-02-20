import fastify from "fastify"
import cookie from '@fastify/cookie'
import { userRoutes } from "./routes/userRoutes"
import { properyRoutes } from "./routes/propertyRoutes"

export const app = fastify()

app.register(cookie)

app.register(userRoutes, {
    prefix: 'users'
})

app.register(properyRoutes, {
    prefix: 'propertys'
})