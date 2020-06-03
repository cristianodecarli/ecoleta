import { Router, Response, Request } from "express";
import knex from "../database/connection";

const pointsRouter = Router();

pointsRouter.post("/", async (request: Request, response: Response) => {
  const {
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
    items,
  } = request.body;

  const trx = await knex.transaction();

  const [point_id] = await trx("points").returning("id").insert({
    image: "https://images.unsplash.com/photo-1545601445-4d6a0a0565f0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
  });

  const pointItems = items.map((item_id: string) => ({ point_id, item_id }));

  await trx("point_items").insert(pointItems);

  await trx.commit();

  return response.json({ success: true, id: point_id });
});

pointsRouter.get("/", async (request: Request, response: Response) => {
  const { city, uf, items } = request.query;

  const parsedItems = String(items)
    .split(",")
    .map((item) => item.trim());

  const points = await knex("points")
    .join("point_items", "points.id", "=", "point_items.point_id")
    .whereIn("point_items.item_id", parsedItems)
    .where("city", String(city))
    .where("uf", String(uf))
    .distinct()
    .select("points.*");

  return response.json(points);
});

pointsRouter.get("/:id", async (request: Request, response: Response) => {
  const { id } = request.params;

  const point = await knex("points").where("id", id).first();

  if (!point) return response.status(404).json({ message: "Point not found." });

  const items = await knex("items")
    .join("point_items", "items.id", "=", "point_items.item_id")
    .where("point_items.point_id", id)
    .select("items.title");

  return response.json({ point, items });
});

export default pointsRouter;
