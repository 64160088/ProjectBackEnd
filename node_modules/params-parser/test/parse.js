var ParamsParser = require('../');

describe('parse', function () {

  var parser;
  var rules;

  beforeEach(function () {

    rules = [

      {
        reg: /test:(\d+)/,
        getter: function (result) {

          return result[1];

        }
    
      },
      
      {
        getter: function (inStr) {

          if (inStr === 'second') {

            return 'yes';
          
          } else {

            return false;
          
          }
        
        }
      
      }
    ];

    parser = new ParamsParser(rules);
  
  });

  it('should throw an exception if rule is invalid', function () {

    var badRuleParser = new ParamsParser([{
      getter: 'bad bad bad' 
    }]);

    (function () {

      badRuleParser.parse('test');
    
    }).should.throw();

  });

  it('should parse stuff sequentially', function () {

    parser.parse('test:1234').should.eql(1234);
    parser.parse('second').should.eql('yes');
  
  });

  it('should throw exception if nothing matched', function () {

    (function () {
      parser.parse('fizz');
    }).should.throw();
  
  });

});
