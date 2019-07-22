import { ApolloServer } from 'apollo-server';
import { Builder } from 'builder-pattern';
import { getLogger } from 'log4js';
import 'reflect-metadata';
import { buildSchemaSync, ResolverData } from 'type-graphql';
import { Container } from 'typedi';
import uuid from 'uuid/v1';
import { Environment } from '../src/environment/Environment';
import { bootstrap } from '../src/graphql/bootstrap';
import { FilmResolver } from '../src/graphql/film/FilmResolver';
import { LikeResolver } from '../src/graphql/like/LikeResolver';
import { PostResolver } from '../src/graphql/post/PostResolver';
import { StarshipResolver } from '../src/graphql/starship/StarshipResolver';
import { UserResolver } from '../src/graphql/user/UserResolver';
import { LoggingExtension } from '../src/graphql/utils/LoggingExtension';
import { Context } from '../src/server/Context';

const logger = getLogger();

// const environment = Container.of(Environment);
Container.set('environment', new Environment());
// console.log(environment);

async function start() {
  const schema = buildSchemaSync({
    resolvers: [UserResolver, PostResolver, LikeResolver, StarshipResolver, FilmResolver],
    validate: true,
    // request scope
    container: ({ context }: ResolverData<Context>) => context.container,
    // global scope
    // container: Container,
  });

  const server = new ApolloServer({
    // schema comes from `buildSchema` as always
    schema,
    // provide unique context with `requestId` for each request
    context: (): Context => {
      // generate the requestId (it also may come from `express-request-id` or other middleware)
      const requestId = generateRequestId();
      const container = Container.of(requestId); // get the scoped container
      // create fresh context object
      const context = Builder(Context)
          .container(container)
          .requestId(requestId)
          .build();
      container.set('context', context); // place context or other data in container
      return context;
    },
    formatResponse: (response: any, { context }: ResolverData<Context>) => {
      // remember to dispose the scoped container to prevent memory leaks
      Container.reset(context.requestId);
      return response;
    },
    extensions: [() => new LoggingExtension()],
    dataSources: () => {
      return {
        // shipService: new StarshipService(),
      };
    },
  });

  // Start the src.server
  const { url } = await server.listen(4000);
  logger.info(`Server is running, GraphQL Playground available at ${ url }`);

  bootstrap();
}

const generateRequestId = () => `${ uuid() }`;

start();
