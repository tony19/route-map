import {json} from '@/lib/handlers/json';

describe('json handler', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      baseUrl: 'https://my-base-url.com',
      params: {
        paramId: 'myParamId',
      },
      query: {
        queryId: 'myQueryId',
      },
    };
    res = {
      json: jest.fn(),
    };
  });

  describe('param keys', () => {
    it('resolves param-keys from JSON key', () => {
      const handler = json`{":paramId": "x"}`;
      expect(handler).toBeInstanceOf(Function);
      handler(req, res);
      expect(res.json).toHaveBeenCalledWith({myParamId: 'x'});
    });

    it('resolves param-keys from JSON value', () => {
      const handler = json`{"x": ":paramId"}`;
      expect(handler).toBeInstanceOf(Function);
      handler(req, res);
      expect(res.json).toHaveBeenCalledWith({x: 'myParamId'});
    });
  });

  describe('query keys', () => {
    it('resolves query-keys from JSON key', () => {
      const handler = json`{":?queryId": "x"}`;
      expect(handler).toBeInstanceOf(Function);
      handler(req, res);
      expect(res.json).toHaveBeenCalledWith({myQueryId: 'x'});
    });

    it('resolves query-keys from JSON value', () => {
      const handler = json`{"x": ":?queryId"}`;
      expect(handler).toBeInstanceOf(Function);
      handler(req, res);
      expect(res.json).toHaveBeenCalledWith({x: 'myQueryId'});
    });
  });

  describe('data keys', () => {
    it('resolves data-keys from JSON key', () => {
      const handler = json`{":{baseUrl}": "x"}`;
      expect(handler).toBeInstanceOf(Function);
      handler(req, res);
      expect(res.json).toHaveBeenCalledWith({[req.baseUrl]: 'x'});
    });

    it('resolves data-keys from JSON value', () => {
      const handler = json`{"x": ":{baseUrl}"}`;
      expect(handler).toBeInstanceOf(Function);
      handler(req, res);
      expect(res.json).toHaveBeenCalledWith({x: req.baseUrl});
    });
  });

  describe('callback keys', () => {
    it('resolves callback-keys from JSON key', () => {
      const handler = json`{"${() => 1 + 100}": "x"}`;
      expect(handler).toBeInstanceOf(Function);
      handler(req, res);
      expect(res.json).toHaveBeenCalledWith({101: 'x'});
    });

    it('resolves callback-keys from JSON value', () => {
      const handler = json`{"x": "${() => 1 + 100}"}`;
      expect(handler).toBeInstanceOf(Function);
      handler(req, res);
      expect(res.json).toHaveBeenCalledWith({x: '101'});
    });

    it('resolves nested callback-keys from JSON key', () => {
      const handler = json`{"${() => () => 1 + 100}": "x"}`;
      expect(handler).toBeInstanceOf(Function);
      handler(req, res);
      expect(res.json).toHaveBeenCalledWith({101: 'x'});
    });

    it('resolves nested callback-keys from JSON value', () => {
      const handler = json`{"x": "${() => () => 1 + 100}"}`;
      expect(handler).toBeInstanceOf(Function);
      handler(req, res);
      expect(res.json).toHaveBeenCalledWith({x: '101'});
    });
  });
});
