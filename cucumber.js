module.exports = {
  default: {
    require: ['e2e/support/**/*.ts', 'e2e/step-definitions/**/*.ts'],
    requireModule: ['tsx/cjs'],
    format: ['progress'],
    paths: ['e2e/features/**/*.feature'],
  },
};

// module.exports = {
//   default: {
//     require: ['e2e/support/**/*.ts', 'e2e/step-definitions/**/*.ts'],
//     requireModule: ['ts-node/register/transpile-only'],
//     format: ['progress'],
//     paths: ['e2e/features/**/*.feature'],
//   },
// };

// module.exports = {
//   default: {
//     require: ['e2e/support/**/*.ts', 'e2e/step-definitions/**/*.ts'],
//     requireModule: ['ts-node/register'],
//     format: ['progress', 'html:e2e/reports/cucumber-report.html'],
//     paths: ['e2e/features/**/*.feature'],
//     publishQuiet: true,
//   },
// };