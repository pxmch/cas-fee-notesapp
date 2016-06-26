/**
 * Created by isa on 25/06/16.
 */

var expect = require("chai").expect;
var router = require("../app/router");

describe("Main App", function () {
  describe("call API", function () {
    it("calls the API endpoint to get all notes", function () {

      var date = new Date(1455778140100);
      expect(redHex).to.equal("2016-02-18");

    });
  })
});

function getFormattedDate(date){
  var d = date;
  var month = (d.getMonth() + 1);
  var day = d.getDate();

  if(month < 10) {
    month = '0' + month;
  }
  if(day < 10) {
    day = '0' + day;
  }
  return d.getFullYear() + '-' + month + '-' + day;
}
