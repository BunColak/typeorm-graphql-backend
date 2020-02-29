import "reflect-metadata";
import { createConnection, useContainer } from "typeorm";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { GraphQLServer } from "graphql-yoga";
import { Container } from "typedi";
import UserResolver from "./resolvers/UserResolver";
import PostResolver from "./resolvers/PostResolver";
import getUser from "./auth/getUser";
import { ContextParameters } from "graphql-yoga/dist/types";
import { authChecker } from "./auth/authChecker";

useContainer(Container);
createConnection()
  .then(async connection => {
    console.log("conencted to database");
    const { resolvers, typeDefs } = await buildTypeDefsAndResolvers({
      resolvers: [UserResolver, PostResolver],
      container: Container,
      authChecker
    });

    const server = new GraphQLServer({
      typeDefs,
      resolvers,
      context: (req: ContextParameters) => ({
        user: getUser(req.request.headers)
      })
    });

    server.start(() => {
      console.log("server started");
    });
  })
  .catch(error => console.log(error));
