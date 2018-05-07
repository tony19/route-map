import logger from '@/lib/logger';
import { resolveKeys } from '@/lib/resolver';
import { RequestHandler } from '@/lib/route-config';
import fs from 'fs';

const allHandlers: {[key: string]: RequestHandler} = {};

export function toRequestHandler(value: string | RequestHandler): RequestHandler {
  let handler = value as RequestHandler;
  if (typeof value === 'string') {
    if (!allHandlers[value]) {
      allHandlers[value] = (req: any, res: any) => {
        const filename = resolveKeys(req, value);
        if (fs.existsSync(filename)) {
          res.json(require(filename));
        } else {
          logger.error(`file not found: ${filename}`);
          res.sendStatus(404);
        }
      };
    }
    handler = allHandlers[value];
  }
  return handler;
}
