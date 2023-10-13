var ParamsParser = require('../');

describe('constructor', function () {

  var rules;

  beforeEach(function () {

    rules = [
      {
        reg: /foo/,
        getter: function () {

          return 'bar';
        
        } 
      }
    ];
  
  });

  it('should return a parser', function () {

    var parser = new ParamsParser(rules);
    parser.should.be.an.instanceOf(ParamsParser);
    parser.should.have.property('parse');
    parser.parse.should.be.Function;
  
  });

  it('should throw an exception if rules are invalid', function () {

    (function () {
      var badParser = new ParamsParser({});
    }).should.throw();
  
  });

});
