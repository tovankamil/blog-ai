import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE = "blog_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const SESSION_SECRET = process.env.BLOG_ADMIN_SESSION_SECRET?.trim() ?? "";

type SessionPayload = {
  email: string;
  displayName: string;
  apiToken: string;
  expiresAt: number;
};

function sign(value: string) {
  return createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

function encode(payload: SessionPayload) {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = sign(body);
  return `${body}.${signature}`;
}

function decode(raw: string): SessionPayload | null {
  const [body, signature] = raw.split(".");
  if (!body || !signature || !SESSION_SECRET) {
    return null;
  }

  const expected = sign(body);
  const left = Buffer.from(signature, "utf8");
  const right = Buffer.from(expected, "utf8");
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (
      !payload.email ||
      !payload.displayName ||
      !payload.apiToken ||
      payload.expiresAt <= Date.now()
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function createAdminSession(
  email: string,
  displayName: string,
  apiToken: string,
) {
  if (!SESSION_SECRET) {
    throw new Error("BLOG_ADMIN_SESSION_SECRET is not configured");
  }

  const cookieStore = await cookies();
  const payload: SessionPayload = {
    email,
    displayName,
    apiToken,
    expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
  };

  cookieStore.set(SESSION_COOKIE, encode(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) {
    return null;
  }

  return decode(raw);
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");
  }

  return session;
}
