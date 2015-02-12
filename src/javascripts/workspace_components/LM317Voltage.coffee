root = exports ? this

# LM317 adjustable regulator calculator
class root.LM317VoltageWorkspace extends root.WorkspaceComponent

  @calculated: null

  contextName: ->
    'LM317Voltage'

  recalc: (element)->
    vout = parseFloat( $('#vout',@container).val() )
    r1 = parseFloat( $('#r1',@container).val() )
    r2 = parseFloat( $('#r2',@container).val() )

    result = @calculateNewValues(vout,r1,r2)
    $('#vout',@container).val(result.vout || '')
    $('#r1',@container).val(result.r1 || '')
    $('#r2',@container).val(result.r2 || '')
    @clearCalculated() if !result.vout && !result.r1 && !result.r2
    $('#' + @calculated,@container).attr('disabled',true) if @calculated
    @updatePermalink()
    true

  determineResultElement: (vout,r1,r2)->
    result = 'r2' if vout && r1 && !r2
    result ||= 'r1' if vout && !r1 && r2
    result ||= 'vout' if !vout && r1 && r2
    result

  calculateNewValues: (vout,r1,r2)->
    @calculated ||= @determineResultElement(vout,r1,r2)
    new_vout = vout
    new_r1 = r1
    new_r2 = r2

    # VOUT = 1.25 * ( 1 + R2/R1 )
    # R2 = R1 ( VOUT / 1.25 - 1 )
    # R1 = R2 / ( VOUT / 1.25 - 1 )
    new_r1 = new_r2 / ( new_vout / 1.25 - 1 ) if @calculated == 'r1'
    new_r2 = new_r1 * ( new_vout / 1.25 - 1 ) if @calculated == 'r2'
    new_vout = 1.25 * ( 1 + new_r2 / new_r1 ) if @calculated == 'vout'

    {
      vout: new_vout,
      r1: new_r1,
      r2: new_r2
    }

  clear: ->
    $('#vout',@container).val('')
    $('#r1',@container).val('')
    $('#r2',@container).val('')
    @clearCalculated()

  clearCalculated: ->
    @calculated = null
    $('[data-trigger=recalc]',@container).attr('disabled',false)


  bodyTitle: ->
    "LM317 Voltage Calculator"

  bodyTemplate: ->
    """
<row>
  <div class="col-md-6">
    <p>
      Given
      <strong>Vout = 1.25 * ( 1 + R2/R1 )</strong>, enter any two values to calculate the other...
    </p>
    <form class="form-horizontal">
      <div class="form-group">
        <label for="voltage" class="control-label">Vout</label>
        <input type="input" class="form-control" data-trigger="recalc" id="vout" placeholder="1.2 to 37 volts" autocomplete="off">
      </div>
      <div class="form-group">
        <label for="resistance" class="control-label">R1</label>
        <input type="input" class="form-control" data-trigger="recalc" id="r1" placeholder="100&Omega; to 1k&Omega;" autocomplete="off">
      </div>
      <div class="form-group">
        <label for="current" class="control-label">R2</label>
        <input type="input" class="form-control" data-trigger="recalc" id="r2" placeholder="&Omega;" autocomplete="off">
      </div>
      <div class="form-group">
        <button class="btn btn-default" data-action="clear">Clear..</button>
      </div>
    </form>
  </div>
  <div class="col-md-6">
    <h4>Typcial Application</h4>
    <p class="text-center">
      <img src="app/images/lm317_overview.png" width="400">
    </p>
  </div>
</row>
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