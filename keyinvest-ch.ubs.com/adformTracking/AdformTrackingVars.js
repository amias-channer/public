class AdformTrackingVars {
  isin = '';

  broker = '';

  setIsin(isin) {
    this.isin = isin;
    return this;
  }

  setBroker(broker) {
    this.broker = broker;
    return this;
  }
}

export default AdformTrackingVars;
