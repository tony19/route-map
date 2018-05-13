import {
  resolveDataKeys,
  resolveKeys,
  resolveParamsKeys,
  resolveQueryKeys,
} from '@/lib/resolver';

describe('resolveDataKeys', () => {
  const req = {
    foo: { bar: { baz: 'hello' } },
  };

  it('resolves keys by object path', () => {
    const result = resolveDataKeys(req, 'this/test/:{foo.bar.baz}/index.html');
    expect(result).toBe('this/test/hello/index.html');
  });

  it('defaults to empty string for nonexistent key', () => {
    const result = resolveDataKeys(
      req,
      'this/test/:{foo.bar.baz}/:{foo.bar.nonexistent}/index.html',
    );
    expect(result).toBe('this/test/hello//index.html');
  });

  it('defaults to empty string for invalid key into primitive', () => {
    const result = resolveDataKeys(
      req,
      'this/test/:{foo.bar.baz}/:{foo.bar.baz.nonexistent}/index.html',
    );
    expect(result).toBe('this/test/hello//index.html');
  });

  it('defaults to empty string for invalid key pointing to object', () => {
    const result = resolveDataKeys(
      req,
      'this/test/:{foo.bar.baz}/:{foo.bar}/index.html',
    );
    expect(result).toBe('this/test/hello//index.html');
  });
});

describe('resolveParamsKeys', () => {
  const req = {
    params: {
      foo: 'hello',
    },
  };

  it('resolves keys by req.params', () => {
    const result = resolveParamsKeys(req, 'this/test/:foo/index.html');
    expect(result).toBe('this/test/hello/index.html');
  });

  it('defaults to empty string for nonexistent key', () => {
    const result = resolveParamsKeys(
      req,
      'this/test/:foo/:nonexistent/index.html',
    );
    expect(result).toBe('this/test/hello//index.html');
  });
});

describe('resolveQueryKeys', () => {
  const req = {
    query: {
      'foo.bar.baz': 'hello',
    },
  };

  it('resolves keys by req.query', () => {
    const result = resolveQueryKeys(req, 'this/test/:?foo.bar.baz/index.html');
    expect(result).toBe('this/test/hello/index.html');
  });

  it('defaults to empty string for nonexistent key', () => {
    const result = resolveQueryKeys(
      req,
      'this/test/:?foo.bar.baz/:?foo.bar.nonexistent/index.html',
    );
    expect(result).toBe('this/test/hello//index.html');
  });
});

describe('resolveKeys', () => {
  const req = {
    a: { b: 200 },
    params: {
      foo: 'hello',
    },
    query: {
      'baz.qux': 'world',
    },
  };

  it('resolves empty string for empty-string input', () => {
    const result = resolveKeys(req, '');
    expect(result).toBe('');
  });

  it('resolves keys by req.params and req.query', () => {
    const result = resolveKeys(req, 'this/test/:foo/:?baz.qux/index:{a.b}.html');
    expect(result).toBe('this/test/hello/world/index200.html');
  });

  it('defaults to empty string for nonexistent params key', () => {
    const result = resolveKeys(
      req,
      'this/test/:foo/:?foo.bar.nonexistent/index.html',
    );
    expect(result).toBe('this/test/hello//index.html');
  });
});
