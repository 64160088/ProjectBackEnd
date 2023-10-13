paramsParser
============

A parser for parsing a string into parameters object.

Parameters parser will sequentially use provided rules to match a input string,
trying to extract parameters from it. If a rule fails to parse the input, parser
will try next one, till all the rules are tried. The parser will return the
result as soon as a succeeded parse occurs.

Usage
=====
Once require the module, you could use it as a constructor. Pass your rules array
into it, it will return a parser based on the rules.

```javascript
var ParamsParser = require('paramsParser');
var rules = [rule1, rule2, rule3];
var parser = new ParamsParser(rules);
var params = parser.parse(inputString);
```

The parser will apply the rules one by one to the input string, till he make a 
success. If all the rules return non-true values, a NO_MATCH_RULE error will
be thrown.

Rules
=====

In paramsParse, you can use regular expression or a function to express your
parsing rules.

regular express
-----

If ``rule.reg`` is given, paramsParser will match the input string with it, and 
pass the result into getter. If the result returned from getter is true, we'll
regard it as a succeeded match.

```javascript
var rule = {

  // a regex object or a string, will use it with .match
  reg: /https*:\/\/([^\/]+)(.*)/, 

  // a getter function
  getter: function (result) {

    return {
      url: result[0],
      host: result[1],
      path: result[2]
    };

  } // a function

}

try {

  var parser = new ParamsParser([rule]);
  var params = parser.parse('http://www.fizz.com/buzz.html');
  console.log(params.url); // http://www.fizz.com/buzz.html
  console.log(params.host); // www.fizz.com
  console.log(params.path); // /buzz.html

} catch (err) {

  console.log(err); // PARAMS_PARSER * err -> NO_MATCH_RULE * input -> xxxx

}

```

getter function only
---------------

If ``rule.reg`` is not provided, paramsParser will pass the input string into the
getter function, and regards a non-false return as a succeeded parse result.

```

var rule = {

  getter: function (inStr) {

    var url = require('url');
    var result = url.parse(inStr, true);
    
    return {
      url: result.href,
      path: result.path + '&numberOfTheBeast=666',
      fizz: 'buzz'
    };

  }

};
var parser = new ParamsParser([rule]);

try {

  var params = parser.parse('http://www.booo.com/search.html');
  console.log(params.url); // http://www.booo.com/search.html
  console.log(params.path); // search.html
  console.log(params.fizz); // buzz

} catch (err) {

  console.log(err);

}
```
