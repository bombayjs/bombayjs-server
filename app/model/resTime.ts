module.exports = app => {
  const mongoose = app.mongoose;
  const ResTimeSchema = new mongoose.Schema({
    name: { type: String },
    entryType: { type: String },
    duration: { type: Number },
    initiatorType: { type: String },
    nextHopProtocol: { type: String },
    workerStart: { type: Number },
    redirectStart: { type: Number },
    redirectEnd: { type: Number },
    fetchStart: { type: Number },
    domainLookupStart: { type: Number },
    domainLookupEnd: { type: Number },
    connectStart: { type: Number },
    connectEnd: { type: Number },
    secureConnectionStart: { type: Number },
    requestStart: { type: Number },
    responseStart: { type: Number },
    responseEnd: { type: Number },
    transferSize: { type: Number },
    encodedBodySize: { type: Number },
    decodedBodySize: { type: Number },
    serverTiming: { type: Array },
  }, { timestamps: true });
  return mongoose.model('ResTime', ResTimeSchema);
};
