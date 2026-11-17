import { createReadStream, createWriteStream } from "node:fs";
import { stat } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import type { Readable } from "node:stream";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutBucketCorsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "./config.ts";

const s3 = new S3Client({
  region: config.s3.region,
  endpoint: config.s3.endpoint,
  credentials: { accessKeyId: config.s3.accessKeyId, secretAccessKey: config.s3.secretAccessKey },
});
const Bucket = config.s3.bucket;

export async function configureCors() {
  if (config.allowedOrigins.length === 0) return;
  await s3.send(
    new PutBucketCorsCommand({
      Bucket,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: config.allowedOrigins,
            AllowedMethods: ["PUT", "GET", "HEAD"],
            AllowedHeaders: ["*"],
            ExposeHeaders: ["ETag"],
            MaxAgeSeconds: 3000,
          },
        ],
      },
    }),
  );
}

export function uploadUrl(key: string, contentType: string, size: number) {
  return getSignedUrl(s3, new PutObjectCommand({ Bucket, Key: key, ContentType: contentType, ContentLength: size }), {
    expiresIn: 2 * 3600,
  });
}

export function downloadUrl(key: string, filename?: string) {
  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket,
      Key: key,
      ResponseContentDisposition: filename ? `attachment; filename="${filename}"` : undefined,
    }),
    { expiresIn: 6 * 3600 },
  );
}

export async function objectSize(key: string): Promise<number | null> {
  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket, Key: key }));
    return head.ContentLength ?? null;
  } catch {
    return null;
  }
}

export async function downloadToFile(key: string, path: string) {
  const { Body } = await s3.send(new GetObjectCommand({ Bucket, Key: key }));
  if (!Body) throw new Error(`Empty object ${key}`);
  await pipeline(Body as Readable, createWriteStream(path));
}

export async function uploadFile(key: string, path: string, contentType: string) {
  const { size } = await stat(path);
  await s3.send(
    new PutObjectCommand({ Bucket, Key: key, Body: createReadStream(path), ContentType: contentType, ContentLength: size }),
  );
}

export async function deleteObject(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket, Key: key }));
}
