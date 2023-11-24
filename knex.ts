import knex from "knex";

const connection = knex({
  client: "pg",
  connection: {
    host: "localhost",
    port: 5432,
    user: "customuser",
    database: "customdb",
    password: "custompassword",
  },
});

type TClient = {
  id: number;
  email: string;
  password: string;
};

async function main() {
  const clients: Array<TClient> = await connection("public.clients").where(
    "email",
    "like",
    "user%"
  );
  for (const client of clients) {
    if (client.id === 1) console.log(client);
  }
}

main();
