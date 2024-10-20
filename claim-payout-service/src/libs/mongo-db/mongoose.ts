import mongoose from "mongoose";

let conn = null;

const uri = process.env.MONGODB_URL;

const connect = async function () {
  if (conn == null) {
    conn = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 5000,
      })
      .then(() => mongoose)
      .catch((e) => {
        throw e;
      });

    // `await`ing connection after assigning to the `conn` variable
    // to avoid multiple function calls creating new connections
    await conn;
  }

  return conn;
};

export default connect;
