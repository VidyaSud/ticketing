import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("new changes in Index");
  console.log("2 nd message");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is not defined.");
  }
  if (!process.env.AUTH_MONGO_URI) {
    throw new Error("AUTH_MONGO_URI must be defined.");
  }
  try {
    await mongoose.connect(process.env.AUTH_MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connecting MongoDB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Auth Service listening to port 3000!!!!!");
  });
};

start();

// JWT Secrete Key generation in kubectl
//  kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
