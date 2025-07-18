import express from "express";

import gameController from "./controller/game/game-controller.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - Hello World",
  });
});

router.use("/game", gameController);

export default router;
