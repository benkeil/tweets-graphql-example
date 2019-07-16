import { GraphQLServer } from 'graphql-yoga';
import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import { bootstrap } from '../graphql/bootstrap';
import { PostResolver } from '../graphql/posts/PostResolver';
import { UserResolver } from '../graphql/user/UserResolver';

async function run() {
  const schema = buildSchemaSync({
    resolvers: [UserResolver, PostResolver],
    validate: true,
  });

  const server = new GraphQLServer({
    schema,
  });

  server.start(() => console.log('graphql listening at http://localhost:4000'));
}

bootstrap();
run();
