const { withAndroidManifest } = require("@expo/config-plugins");


module.exports = function withPhoneOnly(config) {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;


    androidManifest.manifest["supports-screens"] = {
      $: {
        "android:smallScreens": "true",
        "android:normalScreens": "true",
        "android:largeScreens": "false",
        "android:xlargeScreens": "false",
        "android:anyDensity": "true"
      }
    };

    if (!androidManifest.manifest["uses-feature"]) {
      androidManifest.manifest["uses-feature"] = [];
    }

    const usesFeature = androidManifest.manifest["uses-feature"];

    const addFeature = (name, required) => {
      const exists = usesFeature.some(
        (f) => f.$ && f.$["android:name"] === name
      );
      if (!exists) {
        usesFeature.push({
          $: {
            "android:name": name,
            "android:required": String(required)
          }
        });
      }
    };


    addFeature("android.hardware.telephony", true);


    addFeature("android.hardware.touchscreen", true);



    return config;
  });
};