module.exports = function () {

  return {
    files: [
      'tsconfig.json',
      'src/**/*.ts',
      'test/**/*.ts',
      '!test/**/*.spec.ts'
    ],

    tests: ['test/**/*.spec.ts'],

    env: {
      type: 'node',
      runner: 'node'
    },

    testFramework: 'jest'
  };
};