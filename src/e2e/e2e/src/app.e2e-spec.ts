import { by, element, browser, protractor } from 'protractor';
import readXlsxFile from 'read-excel-file/node';

var fs = require('fs');
var glob = require("glob");
var request = require("superagent");
var crypto = require('crypto');
var zlib = require('zlib');
const binaryParser = require('superagent-binary-parser');
var unzipper = require('unzipper');

const browserName = async () => {
  var capabilities = await browser.driver.getCapabilities();
  var browserName = await capabilities.get('browserName');
  return browserName;
}


describe('hyper App ', function () {

  beforeEach(() => {
    browser.ignoreSynchronization = true;
    browser.get('http://localhost/logout');
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  it('should generate a graphic with room usage numbers', async () => {
    var userNameField = await browser.driver.findElement(by.id('username'));
    var userPassField = await browser.driver.findElement(by.id('password'));
    var userLoginBtn = await browser.driver.findElement(by.id('loginbtn'));
    userNameField.sendKeys('lelongj');
    userPassField.sendKeys('motdepasse');
    expect(userNameField.getAttribute('value')).toEqual('lelongj');
    expect(userPassField.getAttribute('value')).toEqual('motdepasse');
    await userLoginBtn.click();
    await browser.waitForAngular();
    var EC = protractor.ExpectedConditions;
    await browser.wait(EC.visibilityOf(element(by.id('graphicLink'))));
    await browser.wait(EC.elementToBeClickable(element(by.id('graphicLink'))));
    await browser.executeScript("arguments[0].click();", element(by.id('graphicLink')));
    expect(await browser.driver.getCurrentUrl()).toMatch('/app/viewgraphics');
    var dateDebut = by.xpath('//*[@id="dateDebut"]/span/input');
    await browser.wait(EC.visibilityOf(element(dateDebut)));
    await browser.wait(EC.presenceOf(element(by.css('p-calendar[ng-reflect-disabled="false"][id="dateDebut"]'))));
    await browser.driver.findElement(dateDebut).clear();
    await browser.executeScript('arguments[0].value = "";', element(dateDebut).getWebElement());
    await browser.driver.findElement(dateDebut).sendKeys('11/04/2018');
    await browser.wait(EC.textToBePresentInElement(element(by.xpath('/html/body/app-root/div/div/ng-component/div/div/div/div[2]/div[1]/div/div[2]')), 'avril 2018'));
    await browser.driver.findElement(dateDebut).click();
    var dateDebutSelect = by.xpath('//*[@id="dateDebut"]/span/div/table/tbody/tr[3]/td[3]/a');
    await browser.wait(EC.visibilityOf(element(dateDebutSelect)));
    await element(dateDebutSelect).click();
    var dateFin = by.xpath('//*[@id="dateFin"]/span/input');
    await browser.wait(EC.visibilityOf(element(dateFin)));
    await browser.wait(EC.presenceOf(element(by.css('p-calendar[ng-reflect-disabled="false"][id="dateFin"]'))));
    await browser.driver.findElement(dateFin).clear();
    await browser.executeScript('arguments[0].value = "";', element(dateFin).getWebElement());
    await browser.driver.findElement(dateFin).sendKeys('05/06/2018');
    await browser.wait(EC.textToBePresentInElement(element(by.xpath('/html/body/app-root/div/div/ng-component/div/div/div/div[2]/div[3]/div/div[2]')), 'juin 2018'));
    await browser.driver.findElement(dateFin).click();
    var dateFinSelect = by.xpath('//*[@id="dateFin"]/span/div/table/tbody/tr[2]/td[2]/a');
    await browser.wait(EC.visibilityOf(element(dateFinSelect)));
    await element(dateFinSelect).click();
    await browser.wait(EC.presenceOf(element(by.css('p-multiselect[ng-reflect-disabled="false"][id="selectSalles"]'))));
    //await element(by.xpath('//*[@id="selectSalles"]/div')).click(); // //*[@id="selectSalles"]/div/div[3]/span
    await browser.wait(EC.elementToBeClickable(element(by.xpath('//*[@id="selectSalles"]/div'))));
    await element(by.xpath('//*[@id="selectSalles"]/div')).click();
    await browser.wait(EC.elementToBeClickable(element(by.xpath('//*[@id="selectSalles"]/div/div[4]/div[2]/ul/li[1]/div'))));
    await element(by.xpath('//*[@id="selectSalles"]/div/div[4]/div[2]/ul/li[1]/div')).click();
    await browser.wait(EC.presenceOf(element(by.css('p-multiselect[ng-reflect-disabled="false"][id="selectSalles"]'))));
    await browser.wait(EC.elementToBeClickable(element(by.xpath('//*[@id="selectSalles"]/div/div[4]/div[2]/ul/li[4]/div'))));
    await element(by.xpath('//*[@id="selectSalles"]/div/div[4]/div[2]/ul/li[4]/div')).click();
    await browser.wait(EC.presenceOf(element(by.css('p-multiselect[ng-reflect-disabled="false"][id="selectSalles"]'))));
    var chart = by.xpath('//*[@id="graphicSalles"]');
    await browser.sleep(1000);
    await browser.wait(EC.presenceOf(element(chart)));
    var values = await element(chart).all(by.css('g[ng-reflect-series="[object Object]"][ngx-charts-series-vertical]'));
    var emptyValuesFirefox = await element(chart).all(by.css('g[ngx-charts-bar][ng-reflect-y="281"]'));
    var emptyValuesChrome = await element(chart).all(by.css('g[ngx-charts-bar][ng-reflect-y="283"]'));
    //expect(await values[13].getAttribute('innerHTML')).toContain('path class="bar" stroke="none"');
    if (!emptyValuesFirefox.length)
      expect(emptyValuesChrome.length).toEqual(31);
    else
      expect(emptyValuesFirefox.length).toEqual(31);

  });


  it('should display welcoming message', async () => {


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
                        browser.wait(EC.textToBePresentInElement(element(by.css('[id="welcome"]')), 'Bienvenue sur l\'application de gestion des présences')).then(function () {
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
    expect(html.toString()).toContain('n°10002 - 5 fiches - Groupe  - Edité le');
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
    expect(await batchElement.getText()).toEqual('  Lot n°10003 - 4 fiches - Groupe - Edité le vendredi 21 septembre 2018 à 16:10:42');
    await browser.executeScript("arguments[0].click();", element(by.id('10003')));
    var elem = element(by.id('title'));
    await browser.wait(EC.visibilityOf(elem));
    var html = await browser.driver.findElement(by.id('title')).getAttribute('innerHTML');
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
    var EC = protractor.ExpectedConditions;
    await browser.wait(EC.visibilityOf(element(by.id('editionLink'))));
    await browser.wait(EC.elementToBeClickable(element(by.id('editionLink'))));
    await browser.executeScript("arguments[0].click();", element(by.id('editionLink')));
    expect(await browser.driver.getCurrentUrl()).toMatch('/app/edition');
    var elm = by.xpath('//*[@id="date-value"]/span/input');
    await browser.wait(EC.visibilityOf(element(elm)));
    await browser.wait(EC.presenceOf(element(by.css('p-calendar[ng-reflect-disabled="false"][id="date-value"]'))));
    await browser.driver.findElement(elm).clear();
    await browser.executeScript('arguments[0].value = "";', element(elm).getWebElement());
    await browser.driver.findElement(elm).sendKeys('13/09/2018');
    await browser.wait(EC.textToBePresentInElement(element(by.xpath('//*[@id="date-value"]/span/div/div/div')), 'septembre 2018'));
    await browser.driver.findElement(elm).click();
    var dateSelect = by.xpath('//*[@id="date-value"]/span/div/table/tbody/tr[3]/td[4]/a');
    await browser.wait(EC.visibilityOf(element(dateSelect))).then(() => {
      browser.driver.findElement(dateSelect).then((buttonDate) => {
        buttonDate.click().then(() => {
          var groupe = by.css('p-selectbutton[ng-reflect-disabled="false"][id="selectGroupe"]');
          browser.wait(EC.presenceOf(element(groupe))).then(() => {
            browser.driver.findElement(by.xpath('//*[@id="selectGroupe"]/div/div[2]/span')).then((buttonGroupe) => {
              buttonGroupe.click().then(() => {
                var schedule = by.xpath('/html/body/app-root/div/div/ng-component/div/section/div/div/table/tbody/tr[3]/div/td[11]');
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
    await browser.wait(EC.visibilityOf(element(by.id('exportLink'))));
    await browser.wait(EC.elementToBeClickable(element(by.id('exportLink'))));
    await browser.executeScript("arguments[0].click();", element(by.id('exportLink')));
    await browser.wait(EC.presenceOf(element(by.xpath('/html/body/app-root/div/div/ng-component/div/div/div/div[2]/div/div/div[3]/div[2]/button'))));
    var exportCsvButton = await browser.driver.findElement(by.xpath('/html/body/app-root/div/div/ng-component/div/div/div/div[2]/div/div/div[3]/div[2]/button'));
    await exportCsvButton.click();
    var cookies = await browser.manage().getCookies();
    var context = await browserName();

    var zipFile = await request.post('http://localhost/api/presence/extraire-excel').type('form')
      .set('Cookie', 'PHPSESSID=' + cookies[0].value)
      .field('datedebut', '01/09/2008')
      .field('datefin', '31/08/2009').parse(binaryParser).buffer()
    fs.writeFileSync('/var/www/html/applications/hyper/data/export_' + context + '.zip', zipFile.body, 'binary');

    var data = await unzipper.Open.file('/var/www/html/applications/hyper/data/export_' + context + '.zip')
    await fs.createReadStream('/var/www/html/applications/hyper/data/export_' + context + '.zip')
      .pipe(unzipper.Extract({ path: '/var/www/html/applications/hyper/data/' })).promise();

    var excelFile = await readXlsxFile('/var/www/html/applications/hyper/data/' + data.files[0].path);
    expect(excelFile[10][7]).toEqual('Amphi Z');
    expect(excelFile[50][4]).toEqual('02/10/2008');
    expect(excelFile[14][7]).toEqual('9.B0.15');

  });


});
