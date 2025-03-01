import type { ReactComponentBuildConfig, WebComponentBuildConfig } from "../../tasks/build/builder/src/types.ts";

export const webComponentList: WebComponentBuildConfig[] = [
  {
    name: "jb-pin-input",
    path: "./lib/jb-pin-input.ts",
    outputPath: "./dist/jb-pin-input.js",
    umdName: "JBPinInput",
    external: ["jb-validation", "jb-form", "jb-core"],
    globals: {
      "jb-validation": "JBValidation",
      "jb-core":"JBCore",
      "jb-form":"JBForm"
    },
  },
];
export const reactComponentList: ReactComponentBuildConfig[] = [
  {
    name: "jb-pin-input-react",
    path: "./react/lib/JBPinInput.tsx",
    outputPath: "./react/dist/JBPinInput.js",
    external: ["jb-pin-input", "prop-types", "react", "jb-core", "jb-core/react"],
    globals: {
      react: "React",
      "prop-types": "PropTypes",
      "jb-pin-input": "JBPinInput",
      "jb-core":"JBCore",
      "jb-core/react":"JBCoreReact"
    },
    umdName: "JBPinInputReact",
    dir: "./react"
  },
];