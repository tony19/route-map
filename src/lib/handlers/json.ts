import logger from '@/lib/logger';
import {resolveKeys} from '@/lib/resolver';

type Callback = () => any;
type KeyType = string | Callback;

/**
 * @returns A request handler that responds with the given JSON data.
 * The data is formatted (special keys are replaced) and then converted
 * into a JSON object before being sent.
 */
export function json(strings: ReadonlyArray<string>, ...keys: KeyType[]): (req: any, res: any) => void {
  return function _json(req: any, res: any) {
    const tmplKeys = keys.map(toKeyStrings).map((key) => resolveKeys(req, key));
    const tmplStr = strings.reduce((p, c, i) => `${p}${tmplKeys[i - 1]}${c}`);
    const tmplObj = JSON.parse(tmplStr);
    Object.keys(tmplObj).map(toKeyStrings).forEach((key) => {
      // replace object key with resolved key
      const k = resolveKeys(req, key);
      if (k) {
        if (k !== key) {
          tmplObj[k] = tmplObj[key];
          delete tmplObj[key];
        }
      } else {
        logger.error(`unknown key in JSON key: ${key}`);
      }

      if (k) {
        // replace object value with resolved value
        const v = resolveKeys(req, tmplObj[k]);
        if (v) {
          if (v !== tmplObj[k]) {
            tmplObj[k] = v;
          }
        } else {
          logger.error(`unknown key in JSON value: ${k}`);
        }
      }
    });
    res.json(tmplObj);
  };
}

function toKeyStrings(k: any): string {
  if (typeof k !== 'string') {
    // if key is a function, call it to get intended key
    while ((k as Callback).call) {
      k = (k as Callback)();
    }

    k = (k as object).toString();
  }
  return k;
}
