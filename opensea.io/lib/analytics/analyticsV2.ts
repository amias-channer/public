import Analytics from "analytics"
import amplitudePlugin from "./plugins/amplitudePlugin"

/**
 * Don't import directly. Use getTrackingFns instead.
 * TODO: Stop exporting this once trackUser is migrated
 */
const analyticsV2 = Analytics({
  app: "opensea",
  plugins: [
    amplitudePlugin({
      // https://amplitude.github.io/Amplitude-JavaScript/Options#options
      includeReferrer: true,
      includeUtm: true,
      includeGclid: true,
      batchEvents: true,
      eventUploadPeriodMillis: 15000,
      eventUploadThreshold: 15,
    }),
  ],
})

export default analyticsV2
