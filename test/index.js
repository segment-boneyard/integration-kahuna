
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
    kahuna = new Kahuna(settings);
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

      it('should map identify even with no device.id', function(){
        test.maps('identify-no-dev-id');
      });
    });

    describe('track', function(){
      it('should map basic track', function(){
        test.maps('track-basic');
      });

      it('should map full track', function(){
        test.maps('track-full');
      });

      it('should map notraits track', function(){
        test.maps('track-notraits');
      });

      it('should map track with compound object properties', function(){
        test.maps('track-trample');
      });

      it('should strip null properties', function(){
        test.maps('track-bad');
      });
    });
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

    it('should send push token', function(done){
      var json = test.fixture('identify-token');

      json.output.key = settings.apiKey;
      json.output.env = settings.env ? 'p' : 's';

      var output = json.output;
      test
        .identify(json.input)
        .sends(json.output)
        .expects(200)
        .end(done);
    });

    it('identify should have dev_id', function(done){
      var json = test.fixture('identify-no-dev-id');

      json.output.key = settings.apiKey;
      json.output.env = settings.env ? 'p' : 's';

      var output = json.output;
      test
        .identify(json.input)
        .sends(json.output)
        .expects(200)
        .end(done);
    });

    it('should map useragent for firefox', function(done){
      var json = test.fixture('identify-useragent');
      json.input.context.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1';
      json.output.os_name = 'firefox';
      json.output.key = settings.apiKey;
      json.output.env = settings.env ? 'p' : 's';

      test
        .identify(json.input)
        .sends(json.output)
        .expects(200)
        .end(done)
    });

    it('should map useragent for chrome', function(done){
      var json = test.fixture('identify-useragent');
      json.input.context.userAgent = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
      json.output.os_name = 'chrome';
      json.output.key = settings.apiKey;
      json.output.env = settings.env ? 'p' : 's';

      test
        .identify(json.input)
        .sends(json.output)
        .expects(200)
        .end(done)
    });

    it('should map useragent for safari', function(done){
      var json = test.fixture('identify-useragent');
      json.input.context.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A';
      json.output.os_name = 'safari';
      json.output.key = settings.apiKey;
      json.output.env = settings.env ? 'p' : 's';

      test
        .identify(json.input)
        .sends(json.output)
        .expects(200)
        .end(done)
    });

    it('should fallback to web for useragent', function(done){
      var json = test.fixture('identify-useragent');
      json.input.context.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko';
      json.output.os_name = 'web';
      json.output.key = settings.apiKey;
      json.output.env = settings.env ? 'p' : 's';

      test
        .identify(json.input)
        .sends(json.output)
        .expects(200)
        .end(done)
    });
  });

  describe('.track()', function(){
    it('should send basic track', function(done){
      var json = test.fixture('track-basic');

      json.output.key = settings.apiKey;
      json.output.env = settings.env ? 'p' : 's';

      test
        .track(json.input)
        .sends(json.output)
        .expects(200)
        .end(done);
    });

    it('should properly handle case w/o traits', function(done){
      var json = test.fixture('track-notraits');

      json.output.key = settings.apiKey;
      json.output.env = settings.env ? 'p' : 's';

      test
        .track(json.input)
        .sends(json.output)
        .expects(200)
        .end(done);
    });

    it('should properly handle compound objects', function(done){
      var json = test.fixture('track-trample');

      json.output.key = settings.apiKey;
      json.output.env = settings.env ? 'p' : 's';

      test
        .track(json.input)
        .sends(json.output)
        .expects(200)
        .end(done);
    });

    it('should have dev_id with user_id', function(done){
      var json = test.fixture('track-no-dev-id-user-id');

      json.output.key = settings.apiKey;
      json.output.env = settings.env ? 'p' : 's';

      test
        .track(json.input)
        .sends(json.output)
        .expects(200)
        .end(done);
    });

    it('should have dev_id with email', function(done){
      var json = test.fixture('track-no-dev-id-email');

      json.output.key = settings.apiKey;
      json.output.env = settings.env ? 'p' : 's';

      test
        .track(json.input)
        .sends(json.output)
        .expects(200)
        .end(done);
    });
  });
});
