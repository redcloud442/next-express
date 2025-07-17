import express from "express";
import { createValidator, getValidatedData, type ValidatedRequest } from "../../../lib/validation/index.js";
import {
  CreateGameSessionSchema,
  createGameSessionSchema,
  GetGameSessionsSchema,
  getGameSessionsSchema,
} from "../../../lib/validation/schemas.js";
import { createGameSession, getGameSessions } from "../../service/game/game-service";

const gameController = express.Router();

gameController.post("/", createValidator(createGameSessionSchema), async (req: ValidatedRequest, res) => {
  try {
    const validatedData = getValidatedData<CreateGameSessionSchema>(req);

    const gameSession = await createGameSession(validatedData);

    res.status(201).json(gameSession);
  } catch (error) {
    res.status(500).json({ message: "Failed to create game session" });
  }
});

gameController.get("/", createValidator(getGameSessionsSchema, "query"), async (req: ValidatedRequest, res) => {
  try {
    const validatedData = getValidatedData<GetGameSessionsSchema>(req);

    const gameSessions = await getGameSessions(validatedData);

    res.status(200).json(gameSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get game sessions" });
  }
});

export default gameController;
