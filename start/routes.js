"use strict";

const Route = use("Route");

Route.post("users", "UserController.store");
Route.post("sessions", "SessionController.store");

Route.get("files/:id", "FileController.show");

Route.group(() => {
  Route.get("files", "FileController.index");
  Route.put("files/:id", "FileController.update");
}).middleware(["auth"]);
