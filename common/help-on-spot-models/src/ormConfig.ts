 export const ormConfig = {
  "type": "postgres",
  "host": process.env.DATABASE_HOST,
  "port": 5432,
  "username": process.env.DATABASE_USERNAME,
  "password": process.env.DATABASE_PASSWORD,
  "database": process.env.DATABASE_NAME
}
