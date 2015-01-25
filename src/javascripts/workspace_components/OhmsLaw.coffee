root = exports ? this

# ohms law calculator
class root.OhmsLawWorkspace extends root.WorkspaceComponent

  recalc: (element)->
    changing = $(element).attr('id')
    return unless changing
    v = parseFloat( $('#voltage',@container).val() )
    i = parseFloat( $('#current',@container).val() )
    r = parseFloat( $('#resistance',@container).val() )

    if changing == 'voltage'
      new_v = v
      new_i = i || new_v / r
      new_r = new_v / new_i
    if changing == 'current'
      new_i = i
      new_r = r || v / new_i
      new_v = new_i * new_r
    if changing == 'resistance'
      new_r = r
      new_i = i || v / new_r
      new_v = new_i * new_r
    $('#voltage',@container).val(new_v || '') unless changing == 'voltage'
    $('#current',@container).val(new_i || '') unless changing == 'current'
    $('#resistance',@container).val(new_r || '') unless changing == 'resistance'
    true

  clear: ->
    $('#voltage',@container).val('')
    $('#current',@container).val('')
    $('#resistance',@container).val('')

  bodyTitle: ->
    "Ohm's Law Calculator"

  bodyTemplate: ->
    """
<p>
  Enter any two values to calculate the other...
</p>
<form class="form-inline">
  <div class="form-group">
    <label for="voltage" class="control-label">V</label>
    <input type="input" class="form-control" data-trigger="recalc" id="voltage" placeholder="volts" autocomplete="off">
  </div>
  <div class="form-group">
    <label for="current" class="control-label">= i</label>
    <input type="input" class="form-control" data-trigger="recalc" id="current" placeholder="amps" autocomplete="off">
  </div>
  <div class="form-group">
    <label for="resistance" class="control-label">x R</label>
    <input type="input" class="form-control" data-trigger="recalc" id="resistance" placeholder="&Omega;" autocomplete="off">
  </div>
  <div class="form-group">
    <button class="btn btn-default" data-action="clear">Clear..</button>
  </div>
</form>
    """

  references: ->
    [
      {
        href: 'http://en.wikipedia.org/wiki/Ohm%27s_law',
        name: "Ohm's law on Wikipedia"
      }
    ]