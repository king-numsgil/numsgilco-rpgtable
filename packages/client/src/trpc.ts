import { createTRPCReact, type inferReactQueryProcedureOptions } from '@trpc/react-query';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from "server/src";

export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export type TRPC = ReturnType<typeof createTRPCReact<AppRouter>>;
export const trpc: TRPC = createTRPCReact<AppRouter>();
