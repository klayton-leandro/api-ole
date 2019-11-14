"use strict";

const Route = use("Route");

Route.post("users", "UserController.store");
Route.post("admin", "UserController.admin");
Route.post("sessions", "SessionController.store");

Route.get("files/:id", "FileController.show");

Route.get("users", "UserController.index");

Route.group(() => {
  Route.get("files", "FileController.index");
  Route.get("user", "UserController.show");
  Route.get("users/:id/files", "FileController.index");
  Route.get("users/:id/oldFiles", "FileOldController.index");

  Route.put("files/:id", "FileController.update");

  Route.put("files/:id/status", "FileController.status");
  Route.put("users/", "UserController.update");
}).middleware(["auth"]);
