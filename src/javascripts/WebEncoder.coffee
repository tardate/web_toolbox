root = exports ? this

# simple handler of various html/uri encoding tasks
class root.WebEncoder

  constructor: (@container) ->
    @outElement = $('#outText',@container)
    @inElement = $('#inText',@container)
    instance = @
    $('[data-action]',@container).on('click', (e)->
      e.preventDefault()
      action = $(@).data('action')
      instance[action]()
    )

  htmlEncode: ->
    @outElement.val($("<div></div>").text(@inElement.val()).html())

  encodeURI: ->
    @outElement.val(encodeURI(@inElement.val()))

  encodeURIComponent: ->
    @outElement.val(encodeURIComponent(@inElement.val()))

  uriEscape: ->
    @outElement.val(escape(@inElement.val()))
