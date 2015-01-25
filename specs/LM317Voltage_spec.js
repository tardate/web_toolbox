describe("LM317VoltageWorkspace.determineResultElement()", function() {
  var subject = new LM317VoltageWorkspace();

  it("given r1,r2", function() {
    result = subject.determineResultElement(NaN,220.0,1000.0)
    expect(result).toEqual('vout');
  });

  it("given vout,r1", function() {
    result = subject.determineResultElement(7,220.0,NaN)
    expect(result).toEqual('r2');
  });

  it("given vout,r2", function() {
    result = subject.determineResultElement(7,NaN,1000.0)
    expect(result).toEqual('r1');
  });

});

describe("LM317VoltageWorkspace.calculateNewValues()", function() {
  var subject = new LM317VoltageWorkspace();

  beforeEach(function() {
    subject.clear();
  });

  it("can calculate given r1,r2", function() {
    result = subject.calculateNewValues(NaN,220.0,1000.0)
    expect(result.vout.toFixed(2)).toEqual('6.93');
    expect(result.r1).toEqual(220.0);
    expect(result.r2).toEqual(1000.0);
    expect(subject.modified).toEqual('vout');
  });

  it("can calculate given vout,r1", function() {
    result = subject.calculateNewValues(7.0,220.0,NaN)
    expect(result.vout).toEqual(7.0);
    expect(result.r1).toEqual(220.0);
    expect(result.r2.toFixed(2)).toEqual('1012.00');
    expect(subject.modified).toEqual('r2');
  });

  it("can calculate given vout,r2", function() {
    result = subject.calculateNewValues(7.0,NaN,1000.0)
    expect(result.vout).toEqual(7.0);
    expect(result.r1.toFixed(2)).toEqual('217.39');
    expect(result.r2).toEqual(1000.0);
    expect(subject.modified).toEqual('r1');
  });

});