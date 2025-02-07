import fastify from "fastify"
import cookie from '@fastify/cookie'
import { userRoutes } from "./routes/userRoutes"

export const app = fastify()

app.register(cookie)

app.register(userRoutes, {
    prefix: 'users'
})