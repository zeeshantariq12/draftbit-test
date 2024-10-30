import "dotenv/config";
import { Client } from "pg";
import { backOff } from "exponential-backoff";
import express from "express";
import waitOn from "wait-on";
import onExit from "signal-exit";
import cors from "cors";

// Add your routes here
const setupApp = (client: Client): express.Application => {
  const app: express.Application = express();

  app.use(cors());

  app.use(express.json());

  app.get("/examples", async (_req, res) => {
    const { rows } = await client.query(`SELECT * FROM example_table`);
    res.json(rows);
  });


  app.get("/layout-values", async (_req, res) => {
    try {
      const { rows } = await client.query(`SELECT side, value FROM layout_values`);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error retrieving layout values");
    }
  });

  app.put("/layout-values/:side", async (req, res) => {
    const { side } = req.params;
    const { value } = req.body;

    try {
      await client.query(
        `UPDATE layout_values SET value = $1 WHERE side = $2`,
        [value, side]
      );
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error updating layout value");
    }
  });

  return app;
};

// Waits for the database to start and connects
const connect = async (): Promise<Client> => {
  console.log("Connecting");
  const resource = `tcp:${process.env.PGHOST}:${process.env.PGPORT}`;
  console.log(`Waiting for ${resource}`);
  await waitOn({ resources: [resource] });
  console.log("Initializing client");
  const client = new Client();
  await client.connect();
  console.log("Connected to database");

  // Ensure the client disconnects on exit
  onExit(async () => {
    console.log("onExit: closing client");
    await client.end();
  });

  return client;
};

const main = async () => {
  const client = await connect();
  const app = setupApp(client);
  const port = parseInt(process.env.SERVER_PORT);
  app.listen(port, () => {
    console.log(
      `Draftbit Coding Challenge is running at http://localhost:${port}/`
    );
  });
};

main();
