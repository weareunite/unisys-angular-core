// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BASE_API_URL: 'http://127.0.0.1:8000/',
  OAUTH_TOKEN_URL: 'http://127.0.0.1:8000/oauth/token',
  OAUTH_FAST_TOKEN_URL: 'http://127.0.0.1:8000/oauth/fastToken',
  OAUTH_CLIENT_SECRET: 'UZ21LqpWRjgBpfwCLNiBlbR1dNfUZH2X6r65SnvP',
  OAUTH_CLIENT_ID: 1,
  roles: {
    'entry': [
      'default',
    ],
    'user': [
      'contact',
      'draw',
      'default',
      'expense',
      'grant',
      'project',
      'transaction',
      'cofinance',
      'module'
    ],
    'admin': [
      'admin.bank-account',
      'admin.bank-account.create',
      'admin.bank-account.update',
      'admin.bank-account.delete',
      'admin.category',
      'admin.category.create',
      'admin.category.update',
      'admin.category.delete',
      'admin.settings',
      'admin.tags',
      'admin.tags.create',
      'admin.tags.update',
      'admin.tags.delete',
      'admin.users',
      'admin.users.create',
      'admin.users.update',
      'admin.users.delete',
      'contact',
      'contact.create',
      'contact.update',
      'contact.delete',
      'default',
      'draw',
      'draw.create',
      'draw.update',
      'draw.delete',
      'expense',
      'expense.create',
      'expense.update',
      'expense.delete',
      'grant',
      'grant.create',
      'grant.update',
      'grant.delete',
      'project',
      'project.create',
      'project.update',
      'project.delete',
      'transaction',
      'transaction.create',
      'transaction.update',
      'transaction.delete',
      'cofinance',
      'cofinance.create',
      'cofinance.update',
      'cofinance.delete',
      'admin.module',
      'admin.module.create',
      'admin.module.update',
      'admin.module.delete',
      'admin.role',
      'admin.role.create',
      'admin.role.update',
      'admin.role.delete',

    ],
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
