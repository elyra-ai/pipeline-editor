const wmlSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 40 40" fill="#8a3ffc">
  <path d="M22,26H20V17.76l-3.23,3.88a1,1,0,0,1-1.54,0L12,17.76V26H10V15a1,1,0,0,1,.66-.94,1,1,0,0,1,1.11.3L16,19.44l4.23-5.08a1,1,0,0,1,1.11-.3A1,1,0,0,1,22,15Z" />
  <path d="M4.16,14.65l-3-1.75a.76.76,0,1,0-.76,1.32L3.4,16a.76.76,0,1,0,.76-1.31Z" />
  <path d="M8.29,10.52a.73.73,0,0,0,1,.27.75.75,0,0,0,.28-1l-1.74-3a.76.76,0,1,0-1.32.76Z" />
  <path d="M16,9a.76.76,0,0,0,.76-.76V4.76a.76.76,0,1,0-1.52,0V8.25A.76.76,0,0,0,16,9Z" />
  <path d="M22.68,10.79a.75.75,0,0,0,.37.11.76.76,0,0,0,.66-.38l1.75-3a.76.76,0,0,0-1.32-.76l-1.74,3A.75.75,0,0,0,22.68,10.79Z" />
  <path d="M31.9,13.18a.76.76,0,0,0-1-.28l-3,1.75A.76.76,0,0,0,28.6,16l3-1.74A.77.77,0,0,0,31.9,13.18Z" />
</svg>
`;

const jupyterSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
  <g transform="translate(-1638,-1844)">
    <path d="m1788 1886a108.02 108.02 0 0 0 -104.92 82.828 114.07 64.249 0 0 1 104.92 -39.053 114.07 64.249 0 0 1 104.96 39.261 108.02 108.02 0 0 0 -104.96 -83.037zm-104.96 133.01a108.02 108.02 0 0 0 104.96 83.037 108.02 108.02 0 0 0 104.92 -82.828 114.07 64.249 0 0 1 -104.92 39.053 114.07 64.249 0 0 1 -104.96 -39.261z" style="fill:#f57c00;paint-order:fill markers stroke"/>
    <circle cx="1699.5" cy="2110.8" r="22.627" style="fill:#9e9e9e;paint-order:fill markers stroke"/><circle cx="1684.3" cy="1892.6" r="16.617" style="fill:#616161;mix-blend-mode:normal;paint-order:fill markers stroke"/><circle cx="1879.8" cy="1877.4" r="21.213" style="fill:#757575;mix-blend-mode:normal;paint-order:fill markers stroke"/>
  </g>
</svg>
`;

const pythonSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <g transform="translate(-1.5418e-7 -.00046865)">
    <path d="m9.8594 2.0009c-1.58 0-2.8594 1.2794-2.8594 2.8594v1.6797h4.2891c.39 0 .71094.57094.71094.96094h-7.1406c-1.58 0-2.8594 1.2794-2.8594 2.8594v3.7812c0 1.58 1.2794 2.8594 2.8594 2.8594h1.1797v-2.6797c0-1.58 1.2716-2.8594 2.8516-2.8594h5.25c1.58 0 2.8594-1.2716 2.8594-2.8516v-3.75c0-1.58-1.2794-2.8594-2.8594-2.8594zm-.71875 1.6094c.4 0 .71875.12094.71875.71094s-.31875.89062-.71875.89062c-.39 0-.71094-.30062-.71094-.89062s.32094-.71094.71094-.71094z" fill="#3c78aa"/>
    <path d="m17.959 7v2.6797c0 1.58-1.2696 2.8594-2.8496 2.8594h-5.25c-1.58 0-2.8594 1.2696-2.8594 2.8496v3.75a2.86 2.86 0 0 0 2.8594 2.8613h4.2812a2.86 2.86 0 0 0 2.8594 -2.8613v-1.6797h-4.291c-.39 0-.70898-.56898-.70898-.95898h7.1406a2.86 2.86 0 0 0 2.8594 -2.8613v-3.7793a2.86 2.86 0 0 0 -2.8594 -2.8594zm-9.6387 4.5137-.0039.0039c.01198-.0024.02507-.0016.03711-.0039zm6.5391 7.2754c.39 0 .71094.30062.71094.89062a.71 .71 0 0 1 -.71094 .70898c-.4 0-.71875-.11898-.71875-.70898s.31875-.89062.71875-.89062z" fill="#fdd835"/>
  </g>
</svg>
`;

const deployWMLNode = {
  op: "execute-deploy-wml-node",
  description:
    "Deploy stored model on Watson Machine Learning as a web service.",
  label: "Deploy Model",
  image: "data:image/svg+xml;utf8," + encodeURIComponent(wmlSVG),
  properties: [
    {
      id: "model_uid",
      label: "Model Unique ID",
      type: "string",
      helperText: "UID for the stored model on Watson Machine Learning",
      required: true,
    },
    {
      id: "model_name",
      label: "Model Name",
      type: "string",
      helperText: "Model Name on Watson Machine Learning",
      required: true,
    },
    {
      id: "scoring_payload",
      label: "Scoring Payload",
      type: "string",
      helperText: "Sample Payload file name in the object storage",
      default: "",
    },
    {
      id: "deployment_name",
      label: "Deployment Name",
      type: "string",
      helperText: "Deployment Name on Watson Machine Learning",
      default: "",
    },
  ],
};

const fileProperties = [
  {
    id: "filename",
    label: "File",
    helperText: "The path to the notebook file.",
    type: "file",
    extension: ".ipynb",
    required: true,
  },
  {
    id: "runtime_image",
    label: "Runtime Image",
    helperText: "Docker image used as execution environment.",
    type: "string",
    enum: [
      {
        label: "continuumio/anaconda3:2020.07",
      },
      {
        label: "amancevice/pandas:1.0.3",
      },
    ],
    required: true,
  },
  {
    id: "dependencies",
    label: "File Dependencies",
    placeholder: "*.py",
    type: "string[]",
    helperText:
      "Local file dependencies that need to be copied to remote execution environment.",
    default: "",
  },
  {
    id: "include_subdirectories",
    label: "Include Subdirectories",
    helperText:
      "Wether or not to include recursively include subdirectories when submitting a pipeline (This may increase submission time).",
    type: "boolean",
    default: false,
  },
  {
    id: "env_vars",
    label: "Environment Variables",
    placeholder: "ENV_VAR=value",
    type: "string[]",
    helperText: "Environment variables to be set on the execution environment.",
    default: "",
  },
  {
    id: "outputs",
    label: "Output Files",
    placeholder: "*.csv",
    type: "string[]",
    helperText:
      "Files generated during execution that will become available to all subsequent pipeline steps.",
    default: "",
  },
];

const pythonNode = {
  op: "execute-python-node",
  description: "Python file",
  label: "Python",
  labelField: "filename",
  fileField: "filename",
  fileBased: true,
  extension: ".py",
  image: "data:image/svg+xml;utf8," + encodeURIComponent(pythonSVG),
  properties: fileProperties,
};

const notebookNode = {
  op: "execute-notebook-node",
  description: "Notebook file",
  label: "Notebook",
  labelField: "filename",
  fileField: "filename",
  fileBased: true,
  extension: ".ipynb",
  image: "data:image/svg+xml;utf8," + encodeURIComponent(jupyterSVG),
  properties: fileProperties,
};

const nodes = [pythonNode, notebookNode, deployWMLNode];
export default nodes;
