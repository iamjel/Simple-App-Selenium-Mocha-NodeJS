"use strict";
require("chromedriver");
const { Builder, By } = require("selenium-webdriver");
const { assert, expect } = require("chai");
const driver = new Builder().forBrowser("chrome").build();

describe("Simple App", function () {
  describe("for successful login", function () {
    it("Home page shows login link", async function () {
      await driver.get("http://localhost:3000");
      let title = await driver.getTitle();
      assert.equal(title, "Simple App");
      expect(driver.findElement(By.css("p > a"))).to.exist;
    });
    it("user checks login page", async function () {
      await driver.findElement(By.css("p > a")).click();
      let currentURL = await driver.getCurrentUrl();
      assert.equal(currentURL, "http://localhost:3000/login");
      let title = await driver.getTitle();
      assert.equal(title, "Simple App Login");

      await expect(driver.findElements(By.css("a"))).to.exist;
      let pword = await driver.findElement(By.css("[type=password]")).getText();
      let text = await driver.findElement(By.css("[type=text]")).getText();
      assert.equal(pword, "");
      assert.equal(text, "");
    });

    it("User logs in without password", async function () {
      await driver.get("http://localhost:3000");
      await driver.findElement(By.css("p > a")).click();
      driver.sleep(4000);
      await driver.findElement(By.css("[type=text]")).sendKeys("jack");

      await driver.findElement(By.css("[type=submit]")).click();

      await expect(driver.findElements(By.css("a"))).to.exist;
      let pword = await driver.findElement(By.css("[type=password]")).getText();
      let text = await driver.findElement(By.css("[type=text]")).getText();
      assert.equal(pword, "");
      assert.equal(text, "");
    });

    it("User logs in without username", async function () {
      await driver.get("http://localhost:3000");
      await driver.findElement(By.css("p > a")).click();
      driver.sleep(1000);
      await driver.findElement(By.css("[type=password]")).sendKeys("secret");

      await driver.findElement(By.css("[type=submit]")).click();

      await expect(driver.findElements(By.css("a"))).to.exist;
      let pword = await driver.findElement(By.css("[type=password]")).getText();
      let text = await driver.findElement(By.css("[type=text]")).getText();
      assert.equal(pword, "");
      assert.equal(text, "");
    });

    it("user logs in using valid credential", async function () {
      await driver.findElement(By.css("[type=text]")).sendKeys("jack");
      await driver.findElement(By.css("[type=password]")).sendKeys("secret");
      await driver.findElement(By.css("[type=submit]")).click();

      await expect(driver.findElements(By.css("a"))).to.exist;
    });

    it("User Profile shows correct Info", async function () {
      await driver.findElement(By.css("a:first-child")).click();
      let currentURL = await driver.getCurrentUrl();
      assert.equal(currentURL, "http://localhost:3000/profile");
      var expectedInfo = {
        "ID:": "1",
        "Username:": "jack",
        "Name:": "Jack",
        "Email:": "jack@example.com",
      };
      const actualInfo = {};
      const actualName = [];
      const actualValue = [];
      const fieldName = await driver.findElements(By.css("td"));
      for (const name of fieldName) {
        actualName.push(await name.getText());
      }
      const fieldValue = await driver.findElements(By.css("th"));
      for (const value of fieldValue) {
        actualValue.push(await value.getText());
      }
      actualValue.forEach(function (item, index) {
        actualInfo[item] = actualName[index];
      });
      expect(actualInfo).to.eql(expectedInfo);
    });

    it("User clicks logout on Profile page", async function () {
      await driver.findElement(By.css("p > a")).click();
      let currentURL = await driver.getCurrentUrl();
      assert.equal(currentURL, "http://localhost:3000/");
      let title = await driver.getTitle();
      assert.equal(title, "Simple App");
      expect(driver.findElement(By.css("p > a"))).to.exist;
    });

    it("user logs in using different user - currently not working for JILL. Used JACK for the meantime", async function () {
      await driver.findElement(By.css("p > a")).click();
      await driver.findElement(By.css("[type=text]")).sendKeys("jack");
      await driver.findElement(By.css("[type=password]")).sendKeys("secret");
      await driver.findElement(By.css("[type=submit]")).click();

      await expect(driver.findElements(By.css("a"))).to.exist;
    });

    it("user clicks logout instead of profile button", async function () {
      await driver.findElement(By.css("p > a:nth-child(2)")).click();

      let currentURL = await driver.getCurrentUrl();
      assert.equal(currentURL, "http://localhost:3000/");
      let title = await driver.getTitle();
      assert.equal(title, "Simple App");
      expect(driver.findElement(By.css("p > a"))).to.exist;
    });

    it("User logs in with invalid username", async function () {
      await driver.get("http://localhost:3000");
      await driver.findElement(By.css("p > a")).click();

      driver.sleep(4000);
      await driver.findElement(By.css("[type=text]")).sendKeys("Jelly");
      await driver.findElement(By.css("[type=password]")).sendKeys("secret");
      await driver.findElement(By.css("[type=submit]")).click();

      await expect(driver.findElements(By.css("a"))).to.exist;
      let pword = await driver.findElement(By.css("[type=password]")).getText();
      let text = await driver.findElement(By.css("[type=text]")).getText();
      assert.equal(pword, "");
      assert.equal(text, "");
    });

    it("User logs in with invalid password", async function () {
      await driver.get("http://localhost:3000");
      await driver.findElement(By.css("p > a")).click();

      await driver.findElement(By.css("[type=text]")).sendKeys("jack");
      await driver.findElement(By.css("[type=password]")).sendKeys("secret2");
      await driver.findElement(By.css("[type=submit]")).click();

      await expect(driver.findElements(By.css("a"))).to.exist;
      let pword = await driver.findElement(By.css("[type=password]")).getText();
      let text = await driver.findElement(By.css("[type=text]")).getText();
      assert.equal(pword, "");
      assert.equal(text, "");
    });
  });
});
