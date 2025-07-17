import app from "./app.js";
import appConfig from "./config/app.config.js";

const port = appConfig.PORT;
const server = app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});

server.on("error", (err) => {
  if ("code" in err && err.code === "EADDRINUSE") {
    console.error(`Port ${appConfig.PORT} is already in use. Please choose another port or stop the process using it.`);
  } else {
    console.error("Failed to start server:", err);
  }
  process.exit(1);
});
