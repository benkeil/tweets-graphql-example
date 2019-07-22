import { Request } from 'apollo-server-env';
import { GraphQLRequestContext, GraphQLResponse } from 'apollo-server-types';
import { DocumentNode } from 'graphql';
import { GraphQLExtension } from 'graphql-extensions';
import { getLogger } from 'log4js';
import { Context } from '../../server/Context';

export class LoggingExtension<TContext = Context> extends GraphQLExtension<TContext> {

  private logger = getLogger();

  public requestDidStart(o: {
    request: Pick<Request, 'url' | 'method' | 'headers'>;
    queryString?: string;
    parsedQuery?: DocumentNode;
    operationName?: string;
    variables?: { [p: string]: any };
    persistedQueryHit?: boolean;
    persistedQueryRegister?: boolean;
    context: TContext;
    requestContext: GraphQLRequestContext<TContext>
  }): ((...errors: Error[]) => void) | void {

    // this.logger.info(o.request);
  }

  public willSendResponse(o: { graphqlResponse: GraphQLResponse; context: TContext }): void
      | { graphqlResponse: GraphQLResponse; context: TContext } {

    // this.logger.info(JSON.stringify(o));
    return o;
  }
}
