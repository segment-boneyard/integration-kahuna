
var Test = require('segmentio-integration-tester');
var Kahuna = require('../');
var mapper = require('../lib/mapper');

describe('Kahuna', function(){
  var kahuna;
  var settings;
  var test;

  beforeEach(function(){
    settings = {
      apiKey: '6bc9b7c617d5436baf11d8a113499435',
      env: false
    };
    kahuna = new Kahuna(settings)
    test = Test(kahuna, __dirname);
    test.mapper(mapper);
  });

  it('should have the correct settings', function(){
    test
      .name('Kahuna')
      .channels(['server', 'mobile', 'client'])
      .ensure('settings.apiKey')
      .retries(2);
  });

  describe('.validate()', function(){
    it('should not be valid without an api key', function(){
      delete settings.apiKey;
      test.invalid({}, settings);
    });

    it('should be valid with complete settings', function(){
      test.valid({}, settings);
    });
  });

  describe('mapper', function(){
    describe('identify', function(){
      it('should map basic identify', function(){
        test.maps('identify-basic');
      });
    });

    /*describe('track', function(){
      it('should map basic track', function(){
        test.maps('track-basic');
      });
    });*/

  });

  describe('.identify()', function(){
    it('should send basic identify', function(done){
      var json = test.fixture('identify-basic');

      json.output.key = settings.apiKey;
      json.output.env = settings.env ? 'p' : 's';

      var output = json.output;
      test
        .identify(json.input)
        .sends(json.output)
        .expects(200)
        .end(done);
    });

  });

  /*describe('.track()', function(){
    it('should send basic track', function(done){
      var json = test.fixture('track-basic');
      var output = json.output;
      output.timestamp = new Date(output.timestamp);
      test
        .track(json.input)
        .sends(json.output)
        .expects(200)
        .end(done);
    });
  });
*/

});
