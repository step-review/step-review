import componentNamedProps from "./componentNamedProps.js";
import filenameMatchesDefaultExport from "./filenameMatchesDefaultExport.js";
import maxFilesPerFolder from "./maxFilesPerFolder.js";
import maxLines from "./maxLines.js";
import noUnnecessaryDefaultExportVariable from "./noUnnecessaryDefaultExportVariable.js";
import publicExports from "./publicExports.js";

const architecture = {
  meta: { name: "architecture" },
  rules: {
    "component-named-props": componentNamedProps,
    "filename-matches-default-export": filenameMatchesDefaultExport,
    "max-files-per-folder": maxFilesPerFolder,
    "max-lines": maxLines,
    "public-exports": publicExports,
    "no-unnecessary-default-export-variable":
      noUnnecessaryDefaultExportVariable,
  },
};

export default architecture;
