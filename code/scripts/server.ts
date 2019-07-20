import { ApolloServer } from 'apollo-server';
import 'reflect-metadata';
import * as os from 'os';
import { buildSchema, buildSchemaSync, ResolverData } from 'type-graphql';
import { Container } from 'typedi';
import uuid from 'uuid/v1';
import { bootstrap } from '../graphql/bootstrap';
import { LikeResolver } from '../graphql/likes/LikeResolver';
import { PostResolver } from '../graphql/posts/PostResolver';
import { UserResolver } from '../graphql/user/UserResolver';

async function start() {
  bootstrap();

  const schema = buildSchemaSync({
    resolvers: [UserResolver, PostResolver, LikeResolver],
    validate: true,
    container: Container,
  });

  const server = new ApolloServer({
    // schema comes from `buildSchema` as always
    schema,
    // provide unique context with `requestId` for each request
    context: () => {
      // generate the requestId (it also may come from `express-request-id` or other middleware)
      const requestId = generateRequestId();
      const container = Container.of(requestId); // get the scoped container
      const context = { requestId, container }; // create fresh context object
      container.set('context', context); // place context or other data in container
      return context;
    },
  });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${ url }`);
}

const generateRequestId = () => `${ os.hostname() }-${ uuid() }`;

start();
