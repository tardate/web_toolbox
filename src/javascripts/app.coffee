root = exports ? this

# application controller - co-ordinates the marshalling of user input and rendering of the web page view
class root.AppController

  @activate: ->
    new WebEncoder($('form#webEncoder'))


jQuery ->
  new root.AppController.activate()