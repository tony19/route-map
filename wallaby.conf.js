module.exports = function () {

  return {
    files: [
      'tsconfig.json',
      'src/**/*.ts',
      '!test/**/*.ts'
    ],

    tests: ['test/**/*.ts'],

    env: {
      type: 'node',
      runner: 'node'
    },

    testFramework: 'jest'
  };
};