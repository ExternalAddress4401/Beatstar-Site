import { NextApiRequest, NextApiResponse } from "next";
import { CMSRequester } from "@externaladdress4401/protobuf";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.body.game) {
    res.status(400).json({ error: "You didn't supply a game." });
    return;
  }

  const ip =
    req.body.game === "Beatstar"
      ? "socket-gateway.prod.flamingo.apelabs.net"
      : "socket-gateway.prod.robin.apelabs.net";

  const cms = (await CMSRequester.getCMS(ip)).filter(
    (el) => el.name !== "LiveOpsDeeplinkRewardConfig"
  );

  console.log(cms);

  res.status(200).json({ cms: cms.slice(0, 12) });
  res.end();
}
