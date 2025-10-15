import { type Request, Response } from "express";
import { CreateFirebaseUserType } from "@/schemas/user.schema";
import { UserService } from "@/services/user.service";
import { auth } from "@/config/firebase";
import { logger } from "@/config/logger";
import { failure, success } from "@/utils/api-response";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  create = async (req: Request, res: Response) => {
    try {
      console.log("local data", res.locals);
      const payload = req.body as CreateFirebaseUserType;
      const firebaseUser = await this._createFirebaseUser(
        payload.email,
        payload.password,
        payload.name,
        {
          role: payload.account_type,
        },
      );

      const user = await this.userService.createUser({
        email: payload.email,
        firebaseUid: firebaseUser.uid,
        name: payload.name,
        account_type: payload.account_type,
      });

      return res.status(201).json(success(user));
    } catch (error: any) {
      logger.error("Creating user failed in users controller", error);
      return res.status(400).json(failure(error.message));
    }
  };

  private async _createFirebaseUser(
    email: string,
    password: string,
    name?: string,
    claims?: Record<string, any>,
  ) {
    const userRecord = await auth().createUser({
      email,
      password,
      displayName: name,
    });

    if (claims) {
      await auth().setCustomUserClaims(userRecord.uid, claims);
    }

    logger.info("Firebase User created with claims", userRecord);

    return {
      ...userRecord,
      customClaims: claims ?? {},
    };
  }
}
