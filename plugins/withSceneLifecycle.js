// iOS 27 asserts at launch unless the app adopts the UIScene life cycle
// ("UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption").
// Expo SDK 57's generated iOS project does not do this yet, but the expo package ships
// ExpoAppSceneDelegate. This plugin wires it in so every prebuild stays fixed.
// If a future Expo SDK adopts scenes by default, delete this plugin and its app.json entry.
const { withInfoPlist, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withSceneInfoPlist = (config) =>
  withInfoPlist(config, (c) => {
    c.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          { UISceneConfigurationName: 'Default Configuration', UISceneDelegateClassName: '$(PRODUCT_MODULE_NAME).SceneDelegate' },
        ],
      },
    };
    return c;
  });

const withSceneAppDelegate = (config) =>
  withDangerousMod(config, ['ios', async (c) => {
    const file = path.join(c.modRequest.platformProjectRoot, c.modRequest.projectName, 'AppDelegate.swift');
    let src = fs.readFileSync(file, 'utf8');
    if (src.includes('ExpoAppSceneDelegate')) return c;
    src = src.replace('class AppDelegate: ExpoAppDelegate {', 'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {');
    // The scene delegate now creates the window and starts React Native.
    src = src.replace(/#if os\(iOS\) \|\| os\(tvOS\)\s*window = UIWindow\(frame: UIScreen\.main\.bounds\)\s*factory\.startReactNative\([\s\S]*?launchOptions: launchOptions\)\s*#endif\s*/, '');
    src += '\nclass SceneDelegate: ExpoAppSceneDelegate {}\n';
    fs.writeFileSync(file, src);
    return c;
  }]);

module.exports = (config) => withSceneAppDelegate(withSceneInfoPlist(config));
