db = db.getSiblingDB(process.env.DB_NAME);

db.createUser({
  user: process.env.MONGO_USER_NAME,
  pwd: process.env.MONGO_PASSWORD,
  roles: [
    {
      role: "readWrite",
      db: process.env.DB_NAME,
    },
  ],
});
