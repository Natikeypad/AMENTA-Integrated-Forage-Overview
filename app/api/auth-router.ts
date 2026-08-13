import * as cookie from "cookie";
import { z } from "zod";
import * as bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { findUserByEmail, createUser } from "./queries/users";
import { signSessionToken } from "./lib/session";

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),
  
  register: publicQuery
    .input(z.object({
      name: z.string().min(2, "Name is too short"),
      email: z.string().email("Invalid email"),
      password: z.string().min(6, "Password must be at least 6 characters"),
    }))
    .mutation(async ({ input, ctx }) => {
      const existing = await findUserByEmail(input.email);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }
      
      const passwordHash = await bcrypt.hash(input.password, 10);
      const role = input.email === "natnaeltamrat80@gmail.com" ? "admin" : "user";
      const userId = await createUser({
        name: input.name,
        email: input.email,
        passwordHash,
        role,
      });

      const token = await signSessionToken({ userId });
      const cookieOpts = getSessionCookieOptions(ctx.req.headers);
      
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: cookieOpts.httpOnly,
          path: cookieOpts.path,
          sameSite: cookieOpts.sameSite?.toLowerCase() as "lax" | "none" | "strict" | undefined,
          secure: cookieOpts.secure,
          maxAge: Session.maxAgeMs / 1000,
        })
      );
      
      return { success: true, userId };
    }),

  login: publicQuery
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const user = await findUserByEmail(input.email);
      if (!user || !user.passwordHash) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const isValid = await bcrypt.compare(input.password, user.passwordHash);
      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const token = await signSessionToken({ userId: user.id });
      const cookieOpts = getSessionCookieOptions(ctx.req.headers);
      
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: cookieOpts.httpOnly,
          path: cookieOpts.path,
          sameSite: cookieOpts.sameSite?.toLowerCase() as "lax" | "none" | "strict" | undefined,
          secure: cookieOpts.secure,
          maxAge: Session.maxAgeMs / 1000,
        })
      );

      return { success: true, user };
    }),

  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
});
