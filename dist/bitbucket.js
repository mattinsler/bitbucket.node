(function() {
  var Api, Bitbucket, RepositoriesApi, RepositoryApi, Rest,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Rest = require('rest.node');

  Api = {
    Repositories: RepositoriesApi = (function() {
      function RepositoriesApi(client) {
        this.client = client;
      }

      RepositoriesApi.prototype.list = function(cb) {
        return this.client.get("/repositories/" + this.client.options.username, cb);
      };

      RepositoriesApi.prototype.create = function(name, opts, cb) {
        console.log("/repositories/" + this.client.options.username + "/" + name, opts);
        return this.client.post("/repositories/" + this.client.options.username + "/" + name, opts, cb);
      };

      return RepositoriesApi;

    })(),
    Repository: RepositoryApi = (function() {
      function RepositoryApi(client, slug) {
        this.client = client;
        this.slug = slug;
      }

      RepositoryApi.prototype.get = function(cb) {
        return this.client.get("/repositories/" + this.client.options.username + "/" + this.slug, cb);
      };

      RepositoryApi.prototype.destroy = function(name, opts, cb) {
        return this.client["delete"]("/repositories/" + this.client.options.username + "/" + this.slug, cb);
      };

      return RepositoryApi;

    })()
  };

  Bitbucket = (function(_super) {
    __extends(Bitbucket, _super);

    Bitbucket.hooks = {
      json: function(request_opts, opts) {
        if (request_opts.headers == null) {
          request_opts.headers = {};
        }
        return request_opts.headers.Accept = 'application/json';
      },
      auth: function(username, api_key) {
        return function(request_opts, opts) {
          return request_opts.auth = {
            username: username,
            password: api_key
          };
        };
      },
      json_body: function(request_opts, opts) {
        return request_opts.json = opts;
      }
    };

    function Bitbucket(options) {
      this.options = options != null ? options : {};
      Bitbucket.__super__.constructor.call(this, {
        base_url: this.options.base_url || 'https://bitbucket.org/api/2.0'
      });
      this.hook('pre:request', Bitbucket.hooks.json);
      if ((this.options.username != null) && (this.options.api_key != null)) {
        this.hook('pre:request', Bitbucket.hooks.auth(this.options.username, this.options.api_key));
      }
      this.hook('pre:post', Bitbucket.hooks.json_body);
      this.repositories = new Api.Repositories(this);
    }

    Bitbucket.prototype.repository = function(slug) {
      return new Api.Repository(this, slug);
    };

    return Bitbucket;

  })(Rest);

  module.exports = Bitbucket;

}).call(this);
