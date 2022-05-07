// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import S3 from "aws-sdk/clients/s3";
import formidable from "formidable";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890abcdefghjklmnopqrstyzx", 10);
//set bodyparser
export const config = {
  api: {
    bodyParser: false,
  },
};

const s3 = new S3({
  region: "eu-central-1",
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
});

type Data = {
  filename: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const form = new formidable.IncomingForm();
  //TODO tipus szemle: hogy van ez igy elbaszva
  form.parse(req, async function (err, fields, files: any) {
    const id = nanoid();
    if (files.file?.length === undefined) {
      const content = fs.readFileSync(files.file.filepath);
      s3.putObject(
        {
          Bucket: process.env.BUCKET_NAME!,
          Key: id,
          Body: content,
          ContentType: "image/png",
        },
        (resp) => {
          console.log("S3:", resp);
          fs.unlinkSync(files.file.filepath);
          res.status(200).json({ filename: id });
        }
      );
    }
  });
}
