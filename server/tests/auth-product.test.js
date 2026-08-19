import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";
import { Product } from "../src/models/Product.js";
import { setupTestDB, teardownTestDB } from "./test-helpers.js";

let mongo;
let app;

test.before(async () => {
  mongo = await setupTestDB();
  app = createApp();
});

test.after(async () => {
  await teardownTestDB(mongo);
});

test("health endpoint works", async () => {
  const response = await request(app).get("/health");
  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
});

test("login creates an authenticated session", async () => {
  const agent = request.agent(app);

  const response = await agent
    .post("/api/auth/login")
    .send({
      email: "admin@test.local",
      password: "Password123!",
    });

  assert.equal(response.status, 200);
  assert.equal(response.body.user.role, "ADMIN");
  assert.match(response.headers["set-cookie"][0], /erp_access_token=/);

  const me = await agent.get("/api/auth/me");
  assert.equal(me.status, 200);
  assert.equal(me.body.user.email, "admin@test.local");
});

test("unauthenticated product access is rejected", async () => {
  const response = await request(app).get("/api/products");
  assert.equal(response.status, 401);
});

test("admin can create and list products", async () => {
  const agent = request.agent(app);

  await agent.post("/api/auth/login").send({
    email: "admin@test.local",
    password: "Password123!",
  });

  const create = await agent.post("/api/products").send({
    sku: "WT-001",
    name: "Wooden Table",
    salesPrice: 5000,
    costPrice: 3000,
    stockQuantity: 10,
    procurementStrategy: "MTS",
    procurementType: "MANUFACTURE",
  });

  assert.equal(create.status, 201);
  assert.equal(create.body.product.sku, "WT-001");
  assert.equal(create.body.product.stock.onHand, 10);
  assert.equal(create.body.product.freeToUse, 10);

  const list = await agent.get("/api/products");
  assert.equal(list.status, 200);
  assert.equal(list.body.products.length, 1);

  const stored = await Product.findOne({ sku: "WT-001" });
  assert.equal(stored.name, "Wooden Table");
});
