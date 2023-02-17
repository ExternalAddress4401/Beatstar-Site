import { NextApiRequest, NextApiResponse } from "next";
import { readCmsFile } from "../../utils/readCmsFile";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.body.name) {
    res.status(400).json({ error: "You didn't supply a CMS name." });
    return;
  }

  const game = req.body.game ?? "Beatstar";

  const data = await readCmsFile(req.body.name, game);

  res.status(200).json(data);
  res.end();
}
