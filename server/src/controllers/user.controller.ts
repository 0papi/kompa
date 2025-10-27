import { type Request, Response } from "express";
import { CreateFirebaseUserType, UpdateUserType, CompleteOAuthRegistrationType } from "@/schemas/user.schema";
import { UserService } from "@/services/user.service";
import { auth } from "@/config/firebase";
import { logger } from "@/config/logger";
import { failure, success } from "@/utils/api-response";
import type { AuthenticatedRequest } from "@/types/index";
import { slackService } from "@/services/slack.service";

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
        payload.phoneNumber,
        {
          role: payload.account_type,
        },
      );

      const user = await this.userService.createUser({
        email: payload.email,
        firebaseUid: firebaseUser.uid,
        name: payload.name,
        phoneNumber: payload.phoneNumber,
        account_type: payload.account_type,
      });

      // Log to Slack
      await slackService.logAuth(
        "register",
        user.id,
        user.email,
        {
          "Account Type": payload.account_type,
          "Has Phone": payload.phoneNumber ? "Yes" : "No",
        }
      );

      return res.status(201).json(success(user));
    } catch (error: any) {
      logger.error("Creating user failed in users controller", error);
      return res.status(400).json(failure(error.message));
    }
  };

  getProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = res.locals.uid;

      if (!userId) {
        return res.status(401).json(failure("User not authenticated"));
      }

      const user = await this.userService.getUserById(userId);

      if (!user) {
        return res.status(404).json(failure("User not found"));
      }

      return res.status(200).json(success(user));
    } catch (error: any) {
      logger.error("Getting user profile failed", error);
      return res.status(500).json(failure(error.message));
    }
  };

  updateProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = res.locals.uid;
      const firebaseUid = res.locals.firebaseUid;
      const payload = req.body as UpdateUserType;

      if (!userId || !firebaseUid) {
        return res.status(401).json(failure("User not authenticated"));
      }

      // Update database
      const updatedUser = await this.userService.updateUser(userId, payload);

      if (!updatedUser) {
        return res.status(404).json(failure("User not found"));
      }

      // Sync with Firebase
      await this._updateFirebaseUser(firebaseUid, payload);

      return res.status(200).json(success(updatedUser));
    } catch (error: any) {
      logger.error("Updating user profile failed", error);
      return res.status(500).json(failure(error.message));
    }
  };

  /**
   * Complete OAuth registration for Google sign-in users
   * User is already authenticated via Firebase, we just need to collect additional info
   */
  completeOAuthRegistration = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const firebaseUid = res.locals.firebaseUid;
      const payload = req.body as CompleteOAuthRegistrationType;

      if (!firebaseUid) {
        return res.status(401).json(failure("User not authenticated"));
      }

      // Check if user already exists
      const existingUser = await this.userService.getUserByFirebaseUid(firebaseUid);
      if (existingUser) {
        return res.status(400).json(failure("User already registered"));
      }

      // Get Firebase user record to extract email
      const firebaseUser = await auth().getUser(firebaseUid);

      if (!firebaseUser.email) {
        return res.status(400).json(failure("Email not found in Firebase account"));
      }

      // Construct full name from first and last name
      const fullName = `${payload.firstName} ${payload.lastName}`;

      // Create user in database
      const user = await this.userService.createUser({
        email: firebaseUser.email,
        firebaseUid: firebaseUid,
        name: fullName,
        phoneNumber: payload.phoneNumber || undefined,
        account_type: payload.account_type,
      });

      // Update Firebase user with display name and phone number
      const firebaseUpdates: {
        displayName?: string;
        phoneNumber?: string;
      } = {
        displayName: fullName,
      };

      if (payload.phoneNumber) {
        firebaseUpdates.phoneNumber = payload.phoneNumber;
      }

      await auth().updateUser(firebaseUid, firebaseUpdates);

      // Set custom claims in Firebase
      await auth().setCustomUserClaims(firebaseUid, {
        role: payload.account_type,
      });

      // Log to Slack
      await slackService.logAuth(
        "register",
        user.id,
        user.email,
        {
          "Full Name": fullName,
          "Account Type": payload.account_type,
          "Has Phone": payload.phoneNumber ? "Yes" : "No",
          "Sign-in Method": "Google OAuth",
        }
      );

      return res.status(201).json(success(user));
    } catch (error: any) {
      logger.error("Completing OAuth registration failed", error);
      return res.status(400).json(failure(error.message));
    }
  };

  private async _updateFirebaseUser(
    firebaseUid: string,
    payload: UpdateUserType,
  ) {
    const updates: {
      displayName?: string;
      phoneNumber?: string;
    } = {};

    // Update displayName if name is provided
    if (payload.name !== undefined) {
      updates.displayName = payload.name;
    }

    // Update phoneNumber if provided
    if (payload.phoneNumber !== undefined) {
      updates.phoneNumber = payload.phoneNumber;
    }

    // Update Firebase user record if there are any updates
    if (Object.keys(updates).length > 0) {
      await auth().updateUser(firebaseUid, updates);
      logger.info("Firebase user updated", { firebaseUid, updates });
    }

    // Update custom claims if account_type is provided
    if (payload.account_type !== undefined) {
      await auth().setCustomUserClaims(firebaseUid, {
        role: payload.account_type,
      });
      logger.info("Firebase custom claims updated", {
        firebaseUid,
        role: payload.account_type,
      });
    }
  }

  private async _createFirebaseUser(
    email: string,
    password: string,
    name?: string,
    phoneNumber?: string,
    claims?: Record<string, any>,
  ) {
    const userRecord = await auth().createUser({
      email,
      password,
      displayName: name,
      phoneNumber: phoneNumber,
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
