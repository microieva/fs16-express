import { NextFunction, Request, Response } from "express";
import UserService from "../services/usersService.js";
import { ApiError } from "../errors/ApiError.js";

function getAllUsers(
  _: Request, 
  res: Response, 
  next: NextFunction
) {
  const users = UserService.getAllUsers();
  if (users.length === 0) {
    next(ApiError.resourceNotFound("Users can't be fetched"));
    return;
  }
  res.json({ users });
}

function getOneUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = Number(req.params.userId);
  const user = UserService.getOneUser(userId);
  if (!user) {
    next(ApiError.resourceNotFound("User not found."));
    return;
  }
  res.json({ user });
}

function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email } = req.body;
  const user = UserService.handleLogin(name, email);
  if (!user) {
    next(ApiError.resourceNotFound("This user is not registered in the system yet, please sign up first"));
    return;
  }
  res.status(201).json({ user });
}

function createUser(
  req: Request, 
  res: Response,
  next: NextFunction) {
  const newUser = req.body;
  const user = UserService.createUser(newUser);
  if (!user) {
    next(ApiError.badRequest("This user is already in the system"));
    return;
  }
  res.status(201).json({ user }); 
}

function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
  ) {
      const id = Number(req.params.userId);
      const userData = req.body;
      const user = UserService.getOneUser(id);
      if (!user) {
        next(ApiError.resourceNotFound("User can't be updated"));
        return;
      }
      UserService.updateUser(id, userData);
      res.status(200).json(userData);
}

function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
  ) {
      const id = Number(req.params.userId);
      const usersData = UserService.getOneUser(id);
      if (!usersData) {
        next(ApiError.resourceNotFound("User that you are trying to deleter does not exist")); 
        return;
      }
      UserService.deleteUser(id);
      res.status(200).json(usersData);
    }

export default {
  getAllUsers,
  getOneUser,
  login,
  createUser,
  updateUser,
  deleteUser
};
