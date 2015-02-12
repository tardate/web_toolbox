root = exports ? this

# base class for something that operates in a common #workspace panel
class root.WorkspaceComponent

  # Command: activates workspace controller
  @activate: ->
    $('body').bind('workspace.activate', (e,workspaceData)->
      eval('new ' + workspaceData.name + '()')
    )
    $('body').on('click', '[data-workspace]', (e) ->
      link = $(this)
      if workspace_name = link.data('workspace')
        e.preventDefault()
        $('body').trigger('workspace.activate', { name: workspace_name })
        true
    )
    if hash = window.location.hash
      eval('new ' + hash.replace('#','') + 'Workspace()')
    else
      new root.WorkspaceComponent()

  # Default constructor initialises the component attached to a common #workspace element
  # It expects two elements under #workspace:
  # #workspace_title: element that should contain title text
  # #workspace_content: element the component will render itself within
  constructor: ->
    @container = $('#workspace')
    @drawWorkspace()
    @initialiseContext()
    @enableActions()
    @enableRecalc()

  drawWorkspace: ->
    $('#workspace_title',@container).text(@bodyTitle())
    $('#workspace_content',@container).html(@bodyTemplate())
    ref_ul = $('#workspace_references ul.reflist',@container)
    ref_ul.html('')
    if references = @references()
      for reference in references
        a = $('<a></a>')
        a.attr('href',reference.href)
        a.text(reference.name)
        ref_ul.append($('<li></li>').append(a))
      $('#workspace_references',@container).show()
    else
      $('#workspace_references',@container).hide()

  initialiseContext: ->
    window.location.hash = @contextName()
    @applyParams()

  applyParams: ->
    for encoded_param in window.location.search.replace('?','').split('&')
      parts = encoded_param.split('=')
      if parts.length == 2
        name = decodeURIComponent(parts[0])
        value = decodeURIComponent(parts[1])
        $('[data-trigger=recalc]#' + name,@container).val(value)
    true

  enableActions: ->
    instance = @
    $('[data-action]',@container).on('click', (e)->
      e.preventDefault()
      action = $(@).data('action')
      instance[action]()
    )

  enableRecalc: ->
    instance = @
    $('[data-trigger=recalc]',@container).on('change keyup', ()->
      instance.recalc(@)
      true
    )
    instance.recalc()

  updatePermalink: ->
    permalink = []
    for item in $('[data-trigger=recalc]',@container)
      item = $(item)
      value = item.val()
      if value && !item.attr('disabled')
        permalink.push( item.attr('id') + '=' + encodeURIComponent(value))
    if permalink.length > 0
      search = '?' + permalink.join('&')
      $('#workspace_permalink').attr('href', search + '#' + @contextName() ).show()
    else
      search = ''
      $('#workspace_permalink').hide()
    true

  # override in subclasses to implement workspace-specific recalc
  recalc: (element)->
    @updatePermalink()

  # override in subclasses
  contextName: ->
    ''

  # override in subclasses to define workspace-specific title
  bodyTitle: ->
    "About The Toolbox"

  # override in subclasses to define workspace-specific body
  bodyTemplate: ->
    # TODO: maybe switch to handlebars?
    """
<p>
A collection of my most frequently used tools and references for what is sparking my interest at the time.
</p>
<p>
Necessarily a never-ending work-in-progress&mdash;this site is itself a reboot/reworking of stuff that came before&mdash;it also a bit of a playgound
for me to practice my minimalist javascripty/webby fu. So be forewarned! And have a good day ;-)
</p>
    """

  # override in subclasses to define workspace-specific reference list
  references: ->
    null