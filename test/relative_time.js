var expect = require('chai').expect;
var rt = require('../lib/relative_time.js');

function getCurrentDate(plusDate){
  var date = new Date();
  if (plusDate) {
    date = new Date(date.getTime() + (plusDate * 1000) + 10);
  }
  return date;
}

describe('relative time', function () {
  it('show "1 minute left"', function(){
    expect(rt(getCurrentDate(60))).to.equal('1 minute left');
  });

  it('do not show "1 minute left"', function(){
    expect(rt(getCurrentDate(-60))).to.equal('');
  });

  it('show "5 minutes left"', function(){
    expect(rt(getCurrentDate(60*5))).to.equal('5 minutes left');
  });

  it('show "21 hours left"', function(){
    expect(rt(getCurrentDate(60*60*21))).to.equal('21 hours left');
  });

  it('show "1 day left"', function(){
    expect(rt(getCurrentDate(60*60*24))).to.equal('1 day left');
  });

  it('show "2 days left"', function(){
    expect(rt(getCurrentDate(60*60*48))).to.equal('2 days left');
  });

  it('show "now"', function(){
    expect(rt(getCurrentDate(2))).to.equal('ends very soon');
  });


  it('show "5 minutes left" in "de"', function(){
    expect(rt(getCurrentDate(60*5), 'de')).to.equal('noch 5 Minuten');
  });

  it('show "21 hours left" in "de"', function(){
    expect(rt(getCurrentDate(60*60*21), 'de')).to.equal('noch 21 Stunden');
  });

});
