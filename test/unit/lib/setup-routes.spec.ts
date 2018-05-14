import { setupRoutes } from '@/lib/setup-routes';
import { RequestHandler } from '@/lib/route-config';
import { METHODS } from 'http';
import { IRouteConfig } from 'src';

const HTTP_METHODS = METHODS.map((m) => m.toLowerCase());

describe('setupRoutes', () => {
  let app: {[key: string]: IRouteConfig};

  beforeEach(() => {
    app = {};
    HTTP_METHODS.forEach((verb) => {
      (app as any)[verb] = jest.fn();
    });
  });

  it('ignores empty route config', () => {
    setupRoutes(app, {});
    HTTP_METHODS.forEach((verb) => {
      expect(app[verb]).not.toHaveBeenCalled();
    });
  });

  it('ignores unknown verbs in route config', () => {
    setupRoutes(app, {'/api/v1/foo': { unknown: 'foo.json' }});
    HTTP_METHODS.forEach((verb) => {
      expect(app[verb]).not.toHaveBeenCalled();
    });
  });

  it('configures GET with filename', () => {
    setupRoutes(app, {'/api/v1/foo': 'foo.json'});
    HTTP_METHODS.filter((m) => m !== 'get')
        .forEach((verb) => {
          expect(app[verb]).not.toHaveBeenCalled();
        });
    expect(app.get).toHaveBeenCalledWith('/api/v1/foo', expect.any(Function));
  });

  HTTP_METHODS.forEach((method) => {
    it(`configures ${method.toUpperCase()} with config object`, () => {
      const path = '/api/v1/foo';
      setupRoutes(app, {[path]: { [method]: 'foo.json' }});
      HTTP_METHODS.filter((m) => m !== method)
          .forEach((verb) => {
            expect(app[verb]).not.toHaveBeenCalled();
          });
      expect(app[method]).toHaveBeenCalledWith(path, expect.any(Function));
    });
  });
});
