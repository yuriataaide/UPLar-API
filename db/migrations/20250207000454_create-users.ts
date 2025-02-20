import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table) => {
        table.uuid('id').primary()
        table.uuid('session_id').notNullable().unique()
        table.string('name').notNullable()
        table.string('email').notNullable()
        table.integer('number_of_contact').notNullable()
        table.string('profile_type').notNullable()
        table.timestamps(true,true)
    })


}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users')
}

