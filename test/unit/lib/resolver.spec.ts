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
      'foo.bar.baz': 'hello',
    },
  };

  it('resolves keys by req.params', () => {
    const result = resolveParamsKeys(req, 'this/test/:foo.bar.baz/index.html');
    expect(result).toBe('this/test/hello/index.html');
  });

  it('defaults to empty string for nonexistent key', () => {
    const result = resolveParamsKeys(
      req,
      'this/test/:foo.bar.baz/:foo.bar.nonexistent/index.html',
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
