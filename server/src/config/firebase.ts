import admin from "firebase-admin";
import { env } from "./env";
import { logger } from "./logger";

let firebaseInitialized = false;

export function initializeFirebase(): void {
  if (firebaseInitialized) {
    logger.warn("Firebase Admin SDK already initialized");
    return;
  }

  try {
    // Format the private key properly (handle escaped newlines)
    const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        privateKey,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
      }),
    });

    firebaseInitialized = true;
    logger.info("Firebase Admin SDK initialized successfully");
  } catch (error) {
    logger.error("Failed to initialize Firebase Admin SDK", { error });
    throw error;
  }
}

export const auth = () => admin.auth();
