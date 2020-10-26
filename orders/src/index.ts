import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-lisener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";

const start = async () => {
  console.log("New changes");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is not defined.");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("Mongo URI must be defined.");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS CLIENT ID must be defined.");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS URL must be defined.");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS CLUSTER ID must be defined.");
  }

  try {
    await natsWrapper.NatsClientConnect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
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
//  kubectl create secret generic jwt-secret --from-literal JWT_KEY=asdf

//kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=sk_test_6JzcYoThV4aWMz4yrqWMPFuq00LV3px55s
// kubectl get secret
