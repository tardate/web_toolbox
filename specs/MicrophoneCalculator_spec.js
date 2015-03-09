
describe("MicrophoneCalculatorWorkspace.calculateNewValues()", function() {
  var subject = new MicrophoneCalculatorWorkspace();

  beforeEach(function() {
    subject.clear();
  });

  it("can calculate given sensitivity", function() {
    result = subject.calculateNewValues(-45,NaN)
    expect(result.sensitivity).toEqual(-45);
    expect(result.transfer_factor).toEqual(5.6234);
  });
  it("can calculate given sensitivity", function() {
    result = subject.calculateNewValues(NaN,10)
    expect(result.sensitivity).toEqual(-40);
    expect(result.transfer_factor).toEqual(10);
  });


});