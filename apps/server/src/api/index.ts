import express from "express";

import type MessageResponse from "../interfaces/message-response.js";
import gameController from "./controller/game/game-controller.js";

const router = express.Router();

router.get<object, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/game", gameController);

export default router;
