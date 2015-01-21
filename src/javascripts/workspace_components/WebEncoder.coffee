root = exports ? this

# simple handler of various html/uri encoding tasks
class root.WebEncoderWorkspace extends root.WorkspaceComponent

  constructor: ->
    super
    @outElement = $('#outText',@container)
    @inElement = $('#inText',@container)
    instance = @
    $('[data-action]',@container).on('click', (e)->
      e.preventDefault()
      action = $(@).data('action')
      instance[action]()
    )

  bodyText: ->
    "HTML and URI Encoding"

  bodyTemplate: ->
    """
<form id="webEncoder">
  <div class="form-group">
    <label for="inText">source</label>
    <textarea id="inText" class="form-control" rows=6 wrap="off" placeholder="enter your text, html or javaScript to convert here"></textarea>
  </div>
  <div class="form-group">
    <button class="btn btn-default" data-action="htmlEncode">HTML Encode</button>
    <button class="btn btn-default" data-action="encodeURI">URI Encode</button>
    <button class="btn btn-default" data-action="encodeURIComponent">URI Encode Component</button>
    <button class="btn btn-default" data-action="uriEscape">URI Escape</button>
    <button class="btn btn-default" data-action="clearBoth">Clear..</button>
  </div>
  <div class="form-group">
    <label for="outText">encoded output</label>
    <textarea id="outText" class="form-control" rows=6 wrap="off"></textarea>
  </div>
</form>
    """

  references: ->
    [
      {
        href: 'http://old.stevenharman.net/blog/archive/2007/06/16/url-and-html-encoding-on-the-client-javascript-to-the.aspx',
        name: 'URL and HTML Encoding on the Client? JavaScript to the Rescue!'
      },
      {
        href: 'http://xkr.us/articles/javascript/encode-compare/',
        name: 'Comparing escape(), encodeURI(), and encodeURIComponent()'
      },
      {
        href: 'http://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery',
        name: 'Escaping HTML strings with jQuery'
      }
    ]

  htmlEncode: ->
    @outElement.val($("<div></div>").text(@inElement.val()).html())

  encodeURI: ->
    @outElement.val(encodeURI(@inElement.val()))

  encodeURIComponent: ->
    @outElement.val(encodeURIComponent(@inElement.val()))

  uriEscape: ->
    @outElement.val(escape(@inElement.val()))

  clearBoth: ->
    @outElement.val('')
    @inElement.val('').focus()
