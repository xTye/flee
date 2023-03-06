import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
const firebaseStore = admin.firestore();
import "dotenv/config";

interface ReqPostTeaser {
  content: string;
  at: boolean;
}

export const postTeaser = functions.https.onCall(
  async ({ content, at }: ReqPostTeaser, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called " + "while authenticated."
      );
    }

    const docRef = firebaseStore.collection("admins").doc(context.auth.uid);
    const admin = await docRef.get();

    if (!admin.exists) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Not an admin."
      );
    }

    if (!content || content === "")
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Content parameter must exist."
      );
    if (at === undefined)
      throw new functions.https.HttpsError(
        "invalid-argument",
        "At parameter must exist."
      );

    const res = await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...(at && { content: "<@&803035728958324748>" }),
        embeds: [
          {
            description: content,
            color: 2755640,
          },
        ],
        allowed_mentions: {
          roles: ["803035728958324748"],
        },
      }),
    });

    if (res.status !== 204)
      throw new functions.https.HttpsError("internal", "Discord webhook error");

    return {};
  }
);
