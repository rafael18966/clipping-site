function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 8080),
  supabaseUrl: required("SUPABASE_URL"),
  supabaseSecretKey: required("SUPABASE_SECRET_KEY"),
  deepgramKey: required("DEEPGRAM_API_KEY"),
  s3: {
    bucket: required("S3_BUCKET"),
    endpoint: required("S3_ENDPOINT"),
    region: process.env.S3_REGION || "auto",
    accessKeyId: required("S3_ACCESS_KEY_ID"),
    secretAccessKey: required("S3_SECRET_ACCESS_KEY"),
  },
  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
};

export const limits = {
  maxUploadBytes: 2 * 1024 ** 3,
  maxDurationSeconds: 3 * 3600,
  sourceRetentionDays: 30,
  monthlyMinutes: { free: 60, pro: 300, studio: 1000 } as Record<string, number>,
};

export const planNames: Record<string, string> = { free: "Gratuit", pro: "Pro", studio: "Studio" };
