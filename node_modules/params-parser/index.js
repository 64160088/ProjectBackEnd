function ParamsParser(rules) {
  
  if (!rules || !rules.length) {

    throw new Error('INVALID_RULES * err -> INVALID_RULES * rules -> ' + rules);
  
  }

  this.rules = rules;

};

ParamsParser.prototype.parse = function (inStr) {
  
  var that = this;
  var rules = that.rules;
  var params;

  for (var i=0; i<rules.length; i++) {

    var rule = rules[i];
    var reg = rule.reg;
    var getter = rule.getter;
    var result;

    if (typeof getter !== 'function') {

      throw new Error('PARAMS_PARSER * err -> INVALID_RULE: getter should be a function');
    
    }

    if (reg) {

      var regResult = inStr.match(reg);
      
      if (regResult) {

        result = getter(regResult);
      
      }
    
    } else {

      result = getter(inStr);
    
    }

    if (result) {
    
      return result;

    }

  }

  throw new Error('PARAMS_PARSER * err -> NO_MATCH_RULE * input -> ' + inStr);

};

module.exports = ParamsParser;
