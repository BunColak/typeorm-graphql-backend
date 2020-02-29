import { AuthChecker } from "type-graphql";
import Context from "../types/Context";

export const authChecker: AuthChecker<Context> = (
    { root, args, context, info },
    roles,
  ) => {
    return !!context.user
  };