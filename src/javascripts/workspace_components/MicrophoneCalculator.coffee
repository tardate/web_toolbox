root = exports ? this

# Microphone sensitivity calculator
class root.MicrophoneCalculatorWorkspace extends root.WorkspaceComponent

  contextName: ->
    'MicrophoneCalculator'

  recalc: (element)->
    sensitivity = parseFloat( $('#sensitivity',@container).val() )
    transfer_factor = parseFloat( $('#transfer_factor',@container).val() )
    if element && element.id
      transfer_factor = NaN if element.id == 'sensitivity'
      sensitivity = NaN if element.id == 'transfer_factor'

    result = @calculateNewValues(sensitivity,transfer_factor)
    unless isNaN(result.sensitivity) && isNaN(result.transfer_factor)
      $('#sensitivity',@container).val(result.sensitivity || '')
      $('#transfer_factor',@container).val(result.transfer_factor || '')
    @updatePermalink()
    true

  calculateNewValues: (sensitivity,transfer_factor)->
    new_sensitivity = sensitivity
    new_transfer_factor = transfer_factor

    # Sensitivity = 20×log(Transfer factor)
    # Transfer factor = 10 ^ Sensitivity / 20
    new_sensitivity = Math.round(10000*20*Math.log(transfer_factor*0.001)/Math.log(10))/10000 unless isNaN(transfer_factor)
    new_transfer_factor = Math.round(10000*1000*Math.pow(10,sensitivity/20))/10000 unless isNaN(sensitivity)

    {
      sensitivity: new_sensitivity,
      transfer_factor: new_transfer_factor
    }

  clear: ->
    $('#sensitivity',@container).val('')
    $('#transfer_factor',@container).val('')

  clearCalculated: ->
    $('[data-trigger=recalc]',@container).attr('disabled',false)


  bodyTitle: ->
    "Microphone Sensitivity Calculator"

  bodyTemplate: ->
    """
<row>
  <div class="col-md-6">
    <p>
      Enter one value to calculate the other...
    </p>
    <form class="form-horizontal">
      <div class="form-group">
        <label for="sensitivity" class="control-label">Sensitivity (dB)</label>
        <input type="input" class="form-control" data-trigger="recalc" id="sensitivity" placeholder="dB ref 1V/Pa" autocomplete="off">
      </div>
      <div class="form-group">
        <label for="transfer_factor" class="control-label">Transfer Factor (mV/Pascal)</label>
        <input type="input" class="form-control" data-trigger="recalc" id="transfer_factor" placeholder="mV/Pa" autocomplete="off">
      </div>
      <div class="form-group">
        <button class="btn btn-default" data-action="clear">Clear..</button>
      </div>
    </form>
  </div>
  <div class="col-md-6">
  </div>
</row>
    """

  references: ->
    [
      {
        href: 'http://www.cui.com/product/resource/cma-4544pf-w.pdf',
        name: "CMA-4544PF-W electret sample datasheet"
      }
    ]