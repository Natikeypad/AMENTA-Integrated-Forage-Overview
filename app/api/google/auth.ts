import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import * as cookie from "cookie";
import { env } from "../lib/env";
import { getSessionCookieOptions } from "../lib/cookies";
import { Session } from "@contracts/constants";
import { signSessionToken } from "../lib/session";
import { findUserByGoogleId, findUserByEmail, upsertUser } from "../queries/users";

export function createGoogleOAuthCallbackHandler() {
  return async (c: Context) => {
    const code = c.req.query("code");
    const state = c.req.query("state");
    const error = c.req.query("error");

    if (error) {
      return c.json({ error }, 400);
    }

    if (!code || !state) {
      return c.json({ error: "code and state are required" }, 400);
    }

    try {
      const redirectUri = atob(state);

      // 1. Exchange code for tokens
      const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID || "",
          client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      if (!tokenResp.ok) {
        throw new Error("Failed to exchange Google token");
      }

      const tokens = (await tokenResp.json()) as { access_token: string };

      // 2. Fetch user profile from Google using access token
      const profileResp = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });

      if (!profileResp.ok) {
        throw new Error("Failed to fetch Google profile");
      }

      const profile = (await profileResp.json()) as {
        id: string;
        email: string;
        name: string;
        picture?: string;
      };
      
      // 3. Upsert user
      let user = await findUserByGoogleId(profile.id);
      
      if (!user) {
        // Check if email exists
        user = await findUserByEmail(profile.email);
        if (user) {
          // Link google ID to existing email
          user = await upsertUser({
            ...user,
            googleId: profile.id,
            avatar: user.avatar || profile.picture,
          }) as any; // Note: upsertUser currently returns the result info, we may need to fetch the user again
          user = await findUserByEmail(profile.email);
        } else {
          // Create new user
          await upsertUser({
            googleId: profile.id,
            email: profile.email,
            name: profile.name,
            avatar: profile.picture,
          });
          user = await findUserByEmail(profile.email);
        }
      }

      if (!user) {
        throw new Error("Failed to authenticate user");
      }

      // 4. Create session
      const token = await signSessionToken({ userId: user.id });

      const cookieOpts = getSessionCookieOptions(c.req.raw.headers);
      setCookie(c, Session.cookieName, token, {
        ...cookieOpts,
        maxAge: Session.maxAgeMs / 1000,
      });

      return c.redirect("/", 302);
    } catch (error) {
      console.error("[Google OAuth] Callback failed", error);
      return c.json({ error: "OAuth callback failed" }, 500);
    }
  };
}
