// register module path mappings (in package.json)
import 'module-alias/register';

export { setupRoutes } from '@/lib/setup-routes';
export { IRouteConfig } from '@/lib/route-config';
export { json } from '@/lib/handlers/json';
export { text } from '@/lib/handlers/text';
