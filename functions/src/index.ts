import * as functions from "firebase-functions";
import "dotenv/config";

export const postTeaser = functions.https.onRequest(
  async (request, response) => {
    try {
      const { content } = request.body;
      const url = process.env.DISCORD_WEBHOOK_URL;

      if (!content || content === "" || typeof content !== "string")
        throw new Error("Invalid content");
      if (!url) throw new Error("Invalid discrd webhook URL");
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          content: "<@&803035728958324748>",
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

      if (res.status !== 200) throw new Error("Discord webhook failed");

      response.send("Discord webhook sent!");
    } catch (e) {
      response.send(e);
    }
  }
);
