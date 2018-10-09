//import { HyperPage } from './app.po';
import { by, element, browser, protractor } from 'protractor';
import readXlsxFile from 'read-excel-file/node';

var fs = require('fs');
var glob = require("glob");
var request = require("superagent");
var crypto = require('crypto');
var zlib = require('zlib');
const binaryParser = require('superagent-binary-parser');
var unzipper = require('unzipper');


describe('hyper App', function () {

  beforeEach(() => {
    browser.ignoreSynchronization = true;
    browser.get('http://localhost/logout');
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });



  it('should display welcoming message', () => {


    var EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element(by.id('loginbtn')))).then(() => {
      browser.driver.findElement(by.id('username')).then((userNameField) => {
        userNameField.sendKeys('lelongj').then(() => {
          browser.driver.findElement(by.id('password')).then((userPassField) => {
            userPassField.sendKeys('motdepasse').then(() => {
              browser.driver.findElement(by.id('loginbtn')).then((userLoginBtn) => {
                expect(userNameField.getAttribute('value')).toEqual('lelongj');
                expect(userPassField.getAttribute('value')).toEqual('motdepasse');
                browser.wait(EC.elementToBeClickable(element(by.id('loginbtn')))).then(() => {
                  userLoginBtn.click().then(function () {
                    browser.waitForAngular().then(function () {
                      var EC = protractor.ExpectedConditions;
                      browser.wait(EC.visibilityOf(element(by.css('[id="welcome"]')))).then(function () {
                        browser.driver.findElement(by.id('welcome')).then(function (myElements) {
                          myElements.getText().then(function (text) {
                            expect(text.toString()).toContain('Bienvenue sur l\'application de gestion des présences');
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  it('should find the specified batch', async () => {
    var until = protractor.ExpectedConditions;
    await browser.wait(until.visibilityOf(element(by.id('loginbtn'))));
    var userNameField = await browser.driver.findElement(by.id('username'));
    var userPassField = await browser.driver.findElement(by.id('password'));
    var userLoginBtn = await browser.driver.findElement(by.id('loginbtn'));
    userNameField.sendKeys('lelongj');
    userPassField.sendKeys('motdepasse');
    expect(userNameField.getAttribute('value')).toEqual('lelongj');
    expect(userPassField.getAttribute('value')).toEqual('motdepasse');
    await userLoginBtn.click();
    await browser.waitForAngular();
    expect(browser.driver.getCurrentUrl()).toMatch('/app');
    await browser.wait(until.visibilityOf(element(by.id('listeFavoris3'))));
    var myElement = await browser.driver.findElement(by.id('listeFavoris3'));
    var listeFavoris = await myElement.getText();
    expect(listeFavoris).toEqual('Graphiques 31.1.01 31.1.06 31.3.10');
    await browser.wait(until.visibilityOf(element(by.id('10002'))));
    var lot = await browser.driver.findElement(by.id('10002'));
    var html = await lot.getAttribute('innerHTML');
    expect(html.toString()).toContain('n°10002 - 5 fiches - Edité le');
  });

  it('should click the appropriate batch', async () => {
    var EC = protractor.ExpectedConditions;
    await browser.wait(EC.visibilityOf(element(by.id('loginbtn'))));
    var userNameField = await browser.driver.findElement(by.id('username'));
    var userPassField = await browser.driver.findElement(by.id('password'));
    var userLoginBtn = await browser.driver.findElement(by.id('loginbtn'));
    userNameField.sendKeys('lelongj');
    userPassField.sendKeys('motdepasse');
    expect(userNameField.getAttribute('value')).toEqual('lelongj');
    expect(userPassField.getAttribute('value')).toEqual('motdepasse');
    await userLoginBtn.click();
    await browser.waitForAngular();
    expect(await browser.driver.getCurrentUrl()).toMatch('/app');
    var elm = element(by.xpath('//*[@id="10003"]'));
    await browser.wait(EC.elementToBeClickable(elm));
    var batchElement = await browser.driver.findElement(by.xpath('//*[@id="10003"]'));
    expect(await batchElement.getText()).toEqual('  Lot n°10003 - 4 fiches - Edité le 2018-09-21 16:10:42');
    await browser.driver.findElement(by.xpath('//*[@id="10003"]')).then(element => { element.click(); });
    var elem = element(by.xpath('/html/body/app-root/div/ng-component/div/div/div/div[2]/div[2]/div/form/div/div[1]/div'));
    await browser.wait(EC.presenceOf(elem));
    var html = await browser.driver.findElement(by.xpath('/html/body/app-root/div/ng-component/div/div/div/div[2]/div[2]/div/form/div/div[1]/div')).getAttribute('innerHTML');
    expect(html.toString()).toContain('Cours DRH du lundi 10/09/2018');
  });


  it('should show schedules for a date and download the pdf document', async () => {
    var userNameField = await browser.driver.findElement(by.id('username'));
    var userPassField = await browser.driver.findElement(by.id('password'));
    var userLoginBtn = await browser.driver.findElement(by.id('loginbtn'));
    userNameField.sendKeys('lelongj');
    userPassField.sendKeys('motdepasse');
    expect(userNameField.getAttribute('value')).toEqual('lelongj');
    expect(userPassField.getAttribute('value')).toEqual('motdepasse');
    await userLoginBtn.click();
    await browser.waitForAngular();
    await browser.get('http://localhost/app/edition');
    expect(await browser.driver.getCurrentUrl()).toMatch('/app/edition');
    var elm = by.xpath('//*[@id="date-value"]/span/input');
    var EC = protractor.ExpectedConditions;
    await browser.wait(EC.presenceOf(element(elm)));
    await browser.driver.findElement(elm).clear();
    await browser.driver.findElement(elm).sendKeys('13/09/2018');
    await browser.driver.findElement(elm).click();

    var dateSelect = by.xpath('//*[@id="date-value"]/span/div/table/tbody/tr[3]/td[4]');
    await browser.wait(EC.visibilityOf(element(dateSelect))).then(() => {
      browser.driver.findElement(dateSelect).then((buttonDate) => {
        buttonDate.click().then(() => {
          var groupe = by.css('p-selectbutton[ng-reflect-disabled="false"][id="selectGroupe"]');
          browser.wait(EC.presenceOf(element(groupe))).then(() => {
            browser.driver.findElement(by.xpath('/html/body/app-root/div/ng-component/div/section/div/div/div[2]/div[2]/div/div[2]/p-selectbutton/div/div[2]/span')).then((buttonGroupe) => {
              buttonGroupe.click().then(() => {
                var schedule = by.xpath('/html/body/app-root/div/ng-component/div/section/div/div/table/tbody/tr[3]/div/td[10]');
                browser.wait(EC.presenceOf(element(schedule))).then(() => {
                  browser.driver.findElement(schedule).getAttribute('innerHTML').then((html) => {
                    expect(html).toEqual('35.1.53 - Salle de réunion R6');
                    var button = element(by.xpath('//*[@id="batchButton"]'));
                    browser.wait(EC.visibilityOf(button)).then(() => {
                      browser.wait(EC.elementToBeClickable(element(by.xpath('//*[@id="batchButton"]')))).then(() => {
                        browser.driver.findElement(by.xpath('//*[@id="batchButton"]')).then((buttonCreateBatch) => {
                          buttonCreateBatch.click().then(() => {
                            var downloadButton = element(by.name('download'));
                            browser.wait(EC.visibilityOf(downloadButton)).then(() => {
                              browser.wait(EC.elementToBeClickable(downloadButton)).then(() => {
                                browser.driver.findElement(by.xpath('//*[@id="download"]')).then((buttonVal) => {
                                  buttonVal.click();
                                  browser.wait(EC.presenceOf(element(by.xpath('/html/body/modal/div/div/div')))).then(() => {
                                    browser.wait(EC.invisibilityOf(element(by.xpath('/html/body/modal/div/div/div')))).then(() => {
                                      browser.manage().getCookies().then(function (cookies) {
                                        browser.wait(
                                          request.post('http://localhost/api/presence/sauvegarderlot').set('Content-Type', 'application/pdf')
                                            .set('Cookie', 'PHPSESSID=' + cookies[0].value).buffer()
                                            .then(response => {
                                              expect(parseInt(response.res.headers['content-length'])).toBeGreaterThan(19800);
                                              expect(parseInt(response.res.headers['content-length'])).toBeLessThan(19950);
                                              expect(response.res.headers['content-type']).toMatch('application/pdf');
                                            }));
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });

    });

  });

  it('should download an excel file and check the content', async () => {

    var EC = protractor.ExpectedConditions;
    await browser.wait(EC.visibilityOf(element(by.id('loginbtn'))));
    var userNameField = await browser.driver.findElement(by.id('username'));
    var userPassField = await browser.driver.findElement(by.id('password'));
    var userLoginBtn = await browser.driver.findElement(by.id('loginbtn'));
    userNameField.sendKeys('lelongj');
    userPassField.sendKeys('motdepasse');
    expect(userNameField.getAttribute('value')).toEqual('lelongj');
    expect(userPassField.getAttribute('value')).toEqual('motdepasse');
    await userLoginBtn.click();
    await browser.waitForAngular();
    expect(await browser.driver.getCurrentUrl()).toMatch('/app');
    await browser.get('http://localhost/app/export');
    await browser.wait(EC.presenceOf(element(by.xpath('/html/body/app-root/div/ng-component/div/div/div/div[2]/div/div/div[3]/div[2]/button'))));
    var exportCsvButton = await browser.driver.findElement(by.xpath('/html/body/app-root/div/ng-component/div/div/div/div[2]/div/div/div[3]/div[2]/button'));
    await exportCsvButton.click();
  
    var cookies = await browser.manage().getCookies();
    await browser.wait(
      request.post('http://localhost/api/presence/extraire-excel').type('form')
        .set('Cookie', 'PHPSESSID=' + cookies[0].value)
        .field('datedebut', '01/09/2008')
        .field('datefin', '31/08/2009').parse(binaryParser).buffer()
        .then(response => {
          fs.writeFileSync('/var/www/html/applications/hyper/data/export.zip', response.body, 'binary');
          fs.createReadStream('/var/www/html/applications/hyper/data/export.zip')
            .pipe(unzipper.Parse())
            .on('entry', function (entry) {
              //var fileName = entry.path;
              //var type = entry.type;
              readXlsxFile(entry).then((rows) => {
                expect(rows[10][7]).toEqual('Amphi Z');
                expect(rows[50][4]).toEqual('02/10/2008');
                expect(rows[14][7]).toEqual('9.B0.15');
              });
            });

        }));



  });


});
