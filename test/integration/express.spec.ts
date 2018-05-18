import { setupRoutes } from '@/lib/setup-routes';
import express from 'express';
import { routes } from './routes';

describe('express', () => {
  it('smoke', () => {
    const app = express();
    setupRoutes(app, routes);
  });
});
