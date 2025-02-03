import type { ReactComponentBuildConfig, WebComponentBuildConfig } from "../../tasks/build/builder/src/types.ts";

export const webComponentList: WebComponentBuildConfig[] = [
  {
    name: "jb-pin-input",
    path: "./lib/jb-pin-input.ts",
    outputPath: "./dist/jb-pin-input.js",
    umdName: "JBPinInput",
    external: ["jb-validation", "jb-form"],
    globals: {
      "jb-validation": "JBValidation",
    },
  },
];
export const reactComponentList: ReactComponentBuildConfig[] = [
  {
    name: "jb-pin-input-react",
    path: "./react/lib/JBPinInput.tsx",
    outputPath: "./react/dist/JBPinInput.js",
    external: ["jb-pin-input", "prop-types", "react"],
    globals: {
      react: "React",
      "prop-types": "PropTypes",
    },
    umdName: "JBPinInputReact",
    dir: "./react"
  },
];