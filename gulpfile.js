// Init gulp
let gulp = require('gulp');
let scan = require('gulp-scan');
let pump = require('pump');
let runSequence = require('run-sequence');
let chalk = require('chalk');
let argv = require('yargs').argv;
let log = console.log;
let http = require('http');
let https = require('https');
let Buffer = require('safe-buffer').Buffer;
let querystring = require('querystring');

let appSrc = 'src/app';
let permissions = [];
let uniquePermission = [];
let apiSecret = argv.apiSecret;
let apiHost = argv.apiHost;
let apiPath = argv.apiPath;
let apiPort = argv.apiPort;
let apiProtocol = argv.apiProtocol;

// Scan permission in client app
gulp.task('scanPermissions', function () {
  return pump([
      gulp.src([
          appSrc + '/**/*.ts',
          '../**/*.ts',
          '../../src/app/**/*.ts'
        ]
      ),
      scan({
        term: 'permission:\'(.*?)\'.|permission: \'(.*?)\'.', fn: function (match, file) {
          let matched = match;
          matched = matched.replace("permission:'", "");
          matched = matched.replace("permission: '", "");
          matched = matched.replace("',", "");
          matched = matched.replace("'", "");
          matched = matched.trim();
          let regex = /(.*?).create/gi;
          let created = regex.exec(matched);
          if (created !== null) {
            permissions.push(created[1] + '.delete');
          }
          log('Added permission ' + chalk.red.bold(matched));
          permissions.push(matched);
        }
      })
    ]
  );
});

gulp.task('postPermissions', function () {

  if (typeof apiHost === 'undefined') {
    log(chalk.red.bold('API Host') + chalk.red(' is not defined - aborting'));
    return false;
  }

  if (typeof apiPath === 'undefined') {
    log(chalk.red.bold('API Path') + chalk.red(' is not defined - aborting'));
    return false;
  }

  if (typeof apiSecret === 'undefined') {
    log(chalk.red.bold('API Secret') + chalk.red(' is not defined - aborting'));
    return false;
  }

  uniquePermission = permissions.filter(function (item, pos) {
    return permissions.indexOf(item) == pos;
  });


  let count = uniquePermission.length;
  uniquePermission.sort();
  log('Total amount of ' + chalk.blue.bold(count) + ' permissions scanned in directory ' + chalk.green.bold(appSrc) + ' is sending to database');

  let postData = querystring.stringify({
    'names[]': uniquePermission,
    'secret': apiSecret
  });

  const options = {
    protocol: apiProtocol + ':',
    host: apiHost,
    path: apiPath,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  if (typeof apiPort !== "undefined") {
    options['port'] = apiPort;
  }

  if (apiProtocol === 'http') {

    const req = http.request(options, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
      });
      res.on('end', () => {
        log('Request to API ' + chalk.blue.bold(options.protocol + '//' + apiHost + ':' + apiPort + apiPath) + ' with secret ' + chalk.blue.bold(apiSecret) + ' was sent ' + chalk.green.bold('successfully'));
      });
    });

    req.on('error', (e) => {
      log('Request to API ' + chalk.blue.bold(options.protocol + '//' + apiHost + ':' + apiPort + apiPath) + ' with secret ' + chalk.blue.bold(apiSecret) + ' was sent ' + chalk.red.bold('with error : ' + e.message));
    });

    req.write(postData);
    req.end();
  } else {
    const req = https.request(options, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
      });
      res.on('end', () => {
        log('Request to API ' + chalk.blue.bold(options.protocol + '//' + apiHost + apiPath) + ' with secret ' + chalk.blue.bold(apiSecret) + ' was sent ' + chalk.green.bold('successfully'));
      });
    });

    req.on('error', (e) => {
      log('Request to API ' + chalk.blue.bold(options.protocol + '//' + apiHost + apiPath) + ' with secret ' + chalk.blue.bold(apiSecret) + ' was sent ' + chalk.red.bold('with error : ' + e.message));
    });

    req.write(postData);
    req.end();
  }


});

gulp.task('default', function () {
  runSequence('scanPermissions', 'postPermissions');
});

