import express, { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import AuthService from './services/AuthService';
import sequelize from './database/config';
import logger from './utils/logger';
import { GraphQLContext } from './types';

dotenv.config();

async function startServer(): Promise<void> {
  const app = express();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
  }));
  app.use(cors());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Serve static files
  app.use(express.static('public'));

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }): GraphQLContext => {
      let userId: string | undefined;
      
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.substring(7);
          const decoded = AuthService.verifyToken(token);
          userId = decoded.userId;
        } catch (error) {
          // Token invalid, userId remains undefined
        }
      }
      
      return { userId };
    },
    introspection: true
  });

  await server.start();
  server.applyMiddleware({ app: app as any, path: '/graphql' });

  // Database connection and migration
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    logger.info('Database connected and synchronized');
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }

  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(error => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});

export default startServer;