const UserRouter = require("./UserRouter");
const GameRouter = require("./GameRouter");
const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/game", GameRouter);
};
module.exports = routes;