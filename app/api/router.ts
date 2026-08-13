import { authRouter } from "./auth-router";
import { contactRouter } from "./contact-router";
import { newsletterRouter } from "./newsletter-router";
import { newsRouter } from "./news-router";
import { galleryRouter } from "./gallery-router";
import { teamRouter } from "./team-router";
import { portfolioRouter } from "./portfolio-router";
import { cropsRouter } from "./crops-router";
import { inventoryRouter } from "./inventory-router";
import { supplyChainRouter } from "./supply-chain-router";
import { weatherRouter } from "./weather-router";
import { seasonalPlansRouter } from "./seasonal-plans-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  contact: contactRouter,
  newsletter: newsletterRouter,
  news: newsRouter,
  gallery: galleryRouter,
  team: teamRouter,
  portfolio: portfolioRouter,
  crops: cropsRouter,
  inventory: inventoryRouter,
  supplyChain: supplyChainRouter,
  weather: weatherRouter,
  seasonalPlans: seasonalPlansRouter,
});

export type AppRouter = typeof appRouter;
