import * as jose from "jose";
import { env } from "./env";

export interface SessionPayload {
  userId: number;
}

const JWT_ALG = "HS256";

export async function signSessionToken(
  payload: SessionPayload,
): Promise<string> {
  const secret = new TextEncoder().encode(env.appSecret);
  return new jose.SignJWT(payload as any)
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("1 year")
    .sign(secret);
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  if (!token) {
    console.warn("[session] No token provided for verification.");
    return null;
  }
  try {
    const secret = new TextEncoder().encode(env.appSecret);
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [JWT_ALG],
    });
    const userId = payload.userId as number;
    if (!userId) {
      console.warn("[session] JWT payload missing required fields.");
      return null;
    }
    return { userId };
  } catch (error) {
    console.warn("[session] JWT verification failed:", error);
    return null;
  }
}
