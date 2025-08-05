module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'tests/bdd/steps/shared.steps.ts',
      'tests/bdd/steps/**/*.ts',
      'tests/bdd/support/**/*.ts',
      'tests/bdd/world/**/*.ts'
    ],
    paths: [
      'tests/bdd/features/**/*.feature'
    ],
    format: [
      'progress-bar',
      'html:tests/bdd/reports/report.html',
      'json:tests/bdd/reports/report.json'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true
  }
}; 