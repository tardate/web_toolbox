root = exports ? this

# ohms law calculator
class root.LM317VoltageWorkspace extends root.WorkspaceComponent

  recalc: (element)->
    # VOUT = 1.25 * ( 1 + R2/R1 )
    # R2 = R1 ( VOUT / 1.25 - 1 )
    # R1 = R2 / ( VOUT / 1.25 - 1 )
    changing = $(element).attr('id')
    return unless changing
    vout = parseFloat( $('#vout',@container).val() )
    r1 = parseFloat( $('#r1',@container).val() )
    r2 = parseFloat( $('#r2',@container).val() )

    if changing == 'vout'
      new_vout = vout
      if r1
        new_r1 = r1
        new_r2 = new_r1 * ( new_vout / 1.25 - 1 )
      else
        new_r2 = r2
        new_r1 = new_r2 / ( new_vout / 1.25 - 1 )
    if changing == 'r1'
      new_r1 = r1
      if r2
        new_r2 = r2
        new_vout = 1.25 * ( 1 + new_r2 / new_r1 )
      else
        new_vout = vout
        new_r2 = new_r1 * ( new_vout / 1.25 - 1 )
    if changing == 'r2'
      new_r2 = r2
      if r1
        new_r1 = r1
        new_vout = 1.25 * ( 1 + new_r2 / new_r1 )
      else
        new_vout = vout
        new_r1 = new_r2 / ( new_vout / 1.25 - 1 )
    $('#vout',@container).val(new_vout || '') unless new_vout == vout
    $('#r1',@container).val(new_r1 || '') unless new_r1 == r1
    $('#r2',@container).val(new_r2 || '') unless new_r2 == r2
    true

  clear: ->
    $('#vout',@container).val('')
    $('#r1',@container).val('')
    $('#r2',@container).val('')

  bodyTitle: ->
    "LM317 Voltage Calculator"

  bodyTemplate: ->
    """
<p>
  Enter any two values to calculate the other...
</p>
<form class="form-inline">
  <div class="form-group">
    <label for="voltage" class="control-label">Vout</label>
    <input type="input" class="form-control" data-recalc="trigger" id="vout" placeholder="volts" autocomplete="off">
  </div>
  <div class="form-group">
    <label for="current" class="control-label">= 1.25 * ( R2</label>
    <input type="input" class="form-control" data-recalc="trigger" id="r2" placeholder="&Omega;" autocomplete="off">
  </div>
  <div class="form-group">
    <label for="resistance" class="control-label">/R1 )</label>
    <input type="input" class="form-control" data-recalc="trigger" id="r1" placeholder="&Omega;" autocomplete="off">
  </div>
  <div class="form-group">
    <button class="btn btn-default" data-action="clear">Clear..</button>
  </div>
</form>
    """

  references: ->
    [
      {
        href: 'http://www.futurlec.com/Linear/LM317T.shtml',
        name: "LM317 Datasheet"
      },
      {
        href: 'https://github.com/tardate/LittleArduinoProjects/tree/master/Electronics101/Power317',
        name: "Sample LM317 Arduino Project"
      }
    ]