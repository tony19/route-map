export type RequestHandler = (req: any, res: any, next?: (target?: string) => void) => void;

export interface IRouteConfig {
  [key: string]: string | RequestHandler | IRouteConfig;
}
