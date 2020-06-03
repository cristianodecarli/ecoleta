import { Router, Response, Request } from "express";
import knex from "../database/connection";

const itemsRouter = Router();

itemsRouter.get("/", async (request: Request, response: Response) => {
  const items = await knex("items").select("*");
  const serializeItems = items.map((item) => ({
    id: item.id,
    title: item.title,
    imageUrl: `http://localhost:3333/uploads/${item.image}`,
  }));
  return response.json(serializeItems);
});

export default itemsRouter;
