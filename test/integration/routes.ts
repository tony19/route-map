import { json } from '@/lib/handlers/json';
import path from 'path';

const JSON_DIR_PATH = path.join(__dirname, './data');
const OK_RESP = json`{"message": "ok", "url": ":{originalUrl}"}`;

/* tslint:disable:object-literal-sort-keys */
const routes = {
  '/api/v1/users/plan': {
    delete: OK_RESP,
    get: `${JSON_DIR_PATH}/api/v1/users/plan.json`,
  },
  '/api/v1/users/:id': {
    get: `${JSON_DIR_PATH}/api/v1/users/:id.json`,
    put: OK_RESP,
  },
  '/api/v1/training': `${JSON_DIR_PATH}/api/v1/training.json`,
  '/api/v1/training/zone': {
    put: `${JSON_DIR_PATH}/api/v1/training/zone.json`,
  },
  '/api/v1/activities/calendar': `${JSON_DIR_PATH}/api/v1/activities/calendar.json`,
  '/api/v1/activities/:id(\\d+)': {
    delete: OK_RESP,
    get: `${JSON_DIR_PATH}/api/v1/activities/:id.json`,
    put: OK_RESP,
  },
  '/api/v1/activities/:id/fit': {
    post: `${JSON_DIR_PATH}/api/v1/activities/:id/fit.json`,
  },
  '/api/v1/activities/:id/recalculate': {
    post: `${JSON_DIR_PATH}/api/v1/activities/_id/recalculate.json`,
  },
};
/* tslint:enable:object-literal-sort-keys */

export {
  routes,
};
