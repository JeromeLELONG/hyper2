// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/*global jasmine */
var SpecReporter = require('jasmine-spec-reporter');
var path = require('path');
var downloadsPath = path.resolve(__dirname, './downloads');

exports.config = {
  allScriptsTimeout: 11000,
  SELENIUM_PROMISE_MANAGER: false,
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  /*multiCapabilities: [{
    browserName: 'firefox',
    //firefox_binary: '/usr/bin/firefox',
    marionette: true,
    firefoxOptions: {
      args: ['--headless']
    },
    'moz:firefoxOptions': {
      args: [ '--headless' ]
    }
  }], 
  {
    browserName: 'chrome',
    'chromeOptions': {
    args: ['--no-sandbox', '--headless','--disable-web-security','--safebrowsing-disable-download-protection','--disable-popup-blocking'],
    }
  }],*/
  
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      args: ['--no-sandbox', '--headless','--disable-web-security','--safebrowsing-disable-download-protection','--disable-popup-blocking'],
      prefs: {
        'download': {
            'prompt_for_download': false,
            'directory_upgrade': true,
            'default_directory': downloadsPath,
        },
        'browser': {'set_download_behavior': { 'behavior': 'allow' }},
        'safebrowsing': {'enabled': false,'disable_download_protection': true}
        
    },
    },
  },
  
  directConnect: false,
  seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl: 'http://localhost/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  useAllAngular2AppRoots: true,
  beforeLaunch: function() {
    require('ts-node').register({
      project: 'e2e'
    });
  },
  onPrepare: function() {
    jasmine.getEnv().addReporter(new SpecReporter());
  }
};
