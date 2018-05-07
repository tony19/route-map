import {resolveKeys} from '@/lib/resolver';

/**
 * @returns A request handler that responds with the given text.
 * The data is formatted (special keys are replaced) and then converted
 * into a JSON object before being sent.
 */
export function text(strings: string[], ...keys: string[]) {
  return function _text(req: any, res: any) {
    const output = resolveKeys(req, strings.join(''));
    res.send(output);
  };
}
