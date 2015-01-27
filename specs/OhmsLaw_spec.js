describe("OhmsLawWorkspace.determineResultElement()", function() {
  var subject = new OhmsLawWorkspace();

  it("given current,resistance", function() {
    result = subject.determineResultElement(NaN,220.0,1000.0)
    expect(result).toEqual('voltage');
  });

  it("given voltage,current", function() {
    result = subject.determineResultElement(7,220.0,NaN)
    expect(result).toEqual('resistance');
  });

  it("given voltage,resistance", function() {
    result = subject.determineResultElement(7,NaN,1000.0)
    expect(result).toEqual('current');
  });

});

describe("OhmsLawWorkspace.calculateNewValues()", function() {
  var subject = new OhmsLawWorkspace();

  beforeEach(function() {
    subject.clear();
  });

  it("can calculate given current,resistance", function() {
    result = subject.calculateNewValues(NaN,2.0,4.0)
    expect(result.voltage.toFixed(2)).toEqual('8.00');
    expect(result.current).toEqual(2.0);
    expect(result.resistance).toEqual(4.0);
    expect(subject.calculated).toEqual('voltage');
  });

  it("can calculate given voltage,current", function() {
    result = subject.calculateNewValues(8.0,2.0,NaN)
    expect(result.voltage).toEqual(8.0);
    expect(result.current).toEqual(2.0);
    expect(result.resistance.toFixed(2)).toEqual('4.00');
    expect(subject.calculated).toEqual('resistance');
  });

  it("can calculate given voltage,resistance", function() {
    result = subject.calculateNewValues(8.0,NaN,2.0)
    expect(result.voltage).toEqual(8.0);
    expect(result.current.toFixed(2)).toEqual('4.00');
    expect(result.resistance).toEqual(2.0);
    expect(subject.calculated).toEqual('current');
  });

});