import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('propertys', (table) => {
        table.uuid('id').primary()
        table.uuid('user_id').references('users.id')
        table.string('name').notNullable()
        table.string('adress').notNullable()
        table.integer('price').notNullable()
        table.string('category').notNullable()
        table.string('type').notNullable()
        table.string('description').notNullable()
        table.date('date').notNullable
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('propertys')
}

