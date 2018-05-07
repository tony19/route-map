import {resolveKeys} from '@/lib/resolver';

/**
 * @returns A request handler that responds with the given JSON data.
 * The data is formatted (special keys are replaced) and then converted
 * into a JSON object before being sent.
 */
export function json(strings: string[], ...keys: string[]) {
  return function _json(req: any, res: any) {
    const output = resolveKeys(req, strings.join(''));
    res.json(JSON.parse(output));
  };
}
