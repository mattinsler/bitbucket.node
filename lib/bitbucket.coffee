Rest = require 'rest.node'

Api = {
  # https://confluence.atlassian.com/display/BITBUCKET/repository+Resource
  Repositories: class RepositoriesApi
    constructor: (@client) ->
    list: (cb) -> @client.get("/repositories/#{@client.options.username}", cb)
    create: (name, opts, cb) ->
      console.log "/repositories/#{@client.options.username}/#{name}", opts
      @client.post("/repositories/#{@client.options.username}/#{name}", opts, cb)
  
  # https://confluence.atlassian.com/display/BITBUCKET/repository+Resource
  Repository: class RepositoryApi
    constructor: (@client, @slug) ->
    get: (cb) -> @client.get("/repositories/#{@client.options.username}/#{@slug}", cb)
    destroy: (name, opts, cb) -> @client.delete("/repositories/#{@client.options.username}/#{@slug}", cb)
}

class Bitbucket extends Rest
  @hooks:
    json: (request_opts, opts) ->
      request_opts.headers ?= {}
      request_opts.headers.Accept = 'application/json'
    
    auth: (username, api_key) ->
      (request_opts, opts) ->
        request_opts.auth =
          username: username
          password: api_key
    
    json_body: (request_opts, opts) ->
      request_opts.json = opts
  
  constructor: (@options = {}) ->
    super(base_url: @options.base_url or 'https://bitbucket.org/api/2.0')
    
    @hook('pre:request', Bitbucket.hooks.json)
    @hook('pre:request', Bitbucket.hooks.auth(@options.username, @options.api_key)) if @options.username? and @options.api_key?
    @hook('pre:post', Bitbucket.hooks.json_body)
    
    @repositories = new Api.Repositories(@)
  
  repository: (slug) -> new Api.Repository(@, slug)

module.exports = Bitbucket
