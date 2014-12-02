
var Test = require('segmentio-integration-tester');
var Kahuna = require('../');
var mapper = require('../mapper');

describe('Kahuna', function(){
  var kahuna;
  var settings;
  var test;

  beforeEach(function(){
    settings = {
      key: '6bc9b7c617d5436baf11d8a113499435',
      env: 's'
    };
    kahuna = new Kahuna(settings)
    test = Test(kahuna, __dirname);
    test.mapper(mapper);
  });

  it('should have the correct settings', function(){
    test
      .name('Kahuna')
      .channels(['server', 'mobile'])
      .ensure('settings.apiKey')
      .retries(2);
  });

  describe('.validate()', function() {
    it('should not be valid without an api key', function(){
      delete settings.key;
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
      var output = json.output;
      output.timestamp = new Date(output.timestamp);
      test
        .identify(json.input)
        .sends(json.output)
        .expects(200)
        .end(done);
    });

    it('should error on invalid key', function(done){
      var json = test.fixture('identify-basic');
      test
        .set({ apiKey: 'x' })
        .identify(json.input)
        .error('error message', done);
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

    it('should error on invalid key', function(done){
      var json = test.fixture('track-basic');
      test
        .set({ apiKey: 'x' })
        .track(json.input)
        .error('error message', done);
    });
  });
*/

});
