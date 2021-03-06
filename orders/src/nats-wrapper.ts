import nats, { Stan } from "node-nats-streaming";

class NattsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Connot access NATS client before connecting");
    }
    return this._client;
  }

  NatsClientConnect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Publisher Connected to Nats");
        resolve();
      });

      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NattsWrapper();
