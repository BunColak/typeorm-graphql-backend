import "reflect-metadata";
import { createConnection, useContainer } from "typeorm";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { GraphQLServer } from "graphql-yoga";
import { Container } from "typedi";
import UserResolver from "./resolvers/UserResolver";
import PostResolver from "./resolvers/PostResolver";

useContainer(Container);
createConnection()
  .then(async connection => {
    console.log("conencted to database");
    const { resolvers, typeDefs } = await buildTypeDefsAndResolvers({
      resolvers: [UserResolver, PostResolver],
      container: Container
    });
    const server = new GraphQLServer({ typeDefs, resolvers });

    server.start(() => {
      console.log("server started");
    });
  })
  .catch(error => console.log(error));
