root = exports ? this

# ohms law calculator
class root.OhmsLawWorkspace extends root.WorkspaceComponent

  @calculated: null

  contextName: ->
    'OhmsLaw'

  recalc: (element)->
    voltage = parseFloat( $('#voltage',@container).val() )
    current = parseFloat( $('#current',@container).val() )
    resistance = parseFloat( $('#resistance',@container).val() )

    result = @calculateNewValues(voltage,current,resistance)
    $('#voltage',@container).val(result.voltage || '')
    $('#current',@container).val(result.current || '')
    $('#resistance',@container).val(result.resistance || '')
    @clearCalculated() if !result.voltage && !result.current && !result.resistance
    $('#' + @calculated,@container).attr('disabled',true) if @calculated

    true

  determineResultElement: (voltage,current,resistance)->
    result = 'resistance' if voltage && current && !resistance
    result ||= 'current' if voltage && !current && resistance
    result ||= 'voltage' if !voltage && current && resistance
    result

  calculateNewValues: (voltage,current,resistance)->
    @calculated ||= @determineResultElement(voltage,current,resistance)
    # v = ir
    voltage = current * resistance if @calculated == 'voltage'
    current = voltage / resistance if @calculated == 'current'
    resistance = voltage / current if @calculated == 'resistance'

    {
      voltage: voltage,
      current: current,
      resistance: resistance
    }

  clear: ->
    $('#voltage',@container).val('')
    $('#current',@container).val('')
    $('#resistance',@container).val('')
    @clearCalculated()

  clearCalculated: ->
    @calculated = null
    $('[data-trigger=recalc]',@container).attr('disabled',false)

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