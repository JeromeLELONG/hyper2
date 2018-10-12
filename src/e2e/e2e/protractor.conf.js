// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
var q = require("q");
var FirefoxProfile = require("firefox-profile");
var makeFirefoxProfile = function(preferenceMap) {

    var deferred = q.defer();
    var firefoxProfile = new FirefoxProfile();

    for (var key in preferenceMap) {
        firefoxProfile.setPreference(key, preferenceMap[key]);
    };

    firefoxProfile.encoded(function(encodedProfile) {
        var capabilities = {
            browserName: "firefox",
            "firefox_binary": "/usr/bin/firefox",
            "binary_": "/usr/bin/firefox",
            directConnect: false,
            marionnette: true,
            //"seleniumProtocol": "WebDriver",
            firefox_profile: encodedProfile,
            firefoxOptions: {
                args: ['--headless']
            },
            'moz:firefoxOptions': {
                args: ['--headless'],
                binary: "/usr/bin/firefox",
            }
        };

        deferred.resolve(capabilities);
    });
    return deferred.promise;
};

exports.config = {
    allScriptsTimeout: 11000,
    specs: [
        './src/**/*.e2e-spec.ts'
    ],
    /*
    capabilities: {
      'browserName': 'firefox',
      firefoxOptions: {
        args: ['--headless' ]
      },
      'moz:firefoxOptions': {
        args: [ '--headless' ]
      }
    },*/
    getMultiCapabilities: function() {
        return q.all([
            makeFirefoxProfile(
                {
                    "browser.download.folderList": 2,
                    "browser.download.useDownloadDir": true,
                    "browser.download.manager.showWhenStarting": false,
                    "browser.download.dir": "/tmp/",
                    "browser.helperApps.neverAsk.saveToDisk": "application/zip"
                }
            ),
            {
                'browserName': 'chrome',
                'chromeOptions': {
                    args: ['--no-sandbox', '--headless', '--disable-web-security', '--safebrowsing-disable-download-protection', '--disable-popup-blocking'],
                    prefs: {
                        'download': {
                            'prompt_for_download': false,
                            'directory_upgrade': true,
                            'default_directory': '/var/www/html/applications/hyper/data/',
                        },
                        'browser': { 'set_download_behavior': { 'behavior': 'allow' } },
                        'safebrowsing': { 'enabled': false, 'disable_download_protection': true }

                    },
                },
            },


        ]);
    },

    directConnect: false,
    //baseUrl: 'http://localhost:4200/',
    baseUrl: 'http://localhost/',
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        print: function() { }
    },
    onPrepare() {
        require('ts-node').register({
            project: require('path').join(__dirname, './tsconfig.e2e.json')
        });
        jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    }
};