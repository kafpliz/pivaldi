
const fs = require('fs');
const path = require('path');
const { IOSConfig, createRunOncePlugin, withXcodeProject } = require('@expo/config-plugins');

const HAPTIC_FILE = 'splash_haptic.ahap';

function withIosHaptics(config) {
  return withXcodeProject(config, (config) => {
    const { projectRoot, projectName } = config.modRequest;

    const sourcePath = path.join(projectRoot, 'assets', 'haptics', HAPTIC_FILE);
    const targetDir = path.join(projectRoot, 'ios', projectName, 'haptics');
    const targetPath = path.join(targetDir, HAPTIC_FILE);

    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Missing haptic file: ${sourcePath}`);
    }

    fs.mkdirSync(targetDir, { recursive: true });
    fs.copyFileSync(sourcePath, targetPath);

    const resourcePath = `${projectName}/haptics/${HAPTIC_FILE}`;

    if (!config.modResults.hasFile(resourcePath)) {
      config.modResults = IOSConfig.XcodeUtils.addResourceFileToGroup({
        filepath: resourcePath,
        groupName: projectName,
        project: config.modResults,
        isBuildFile: true,
        verbose: true,
      });
    }

    return config;
  });
}

module.exports = createRunOncePlugin(withIosHaptics, 'with-ios-haptics', '1.0.0');