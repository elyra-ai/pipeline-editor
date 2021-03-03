const node = {
  op: "execute-node",
  description: "A simple node",
  label: "Node",
  labelField: "label",
  image:
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`<svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="m21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44c-.32-.17-.53-.5-.53-.88v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9m-9-12.35-5.96 3.35 5.96 3.35 5.96-3.35-5.96-3.35m-7 11.76 6 3.38v-6.71l-6-3.37v6.7m14 0v-6.7l-6 3.37v6.71z" style="fill:#29b6f6"/>
    </svg>`),
  properties: {
    current_parameters: {
      label: "",
    },
    parameters: [{ id: "label", type: "string" }],
    uihints: {
      id: "nodeProperties",
      parameter_info: [
        {
          parameter_ref: "label",
          label: { default: "Label" },
          description: {
            default: "The label that shows up on the node.",
            placement: "on_panel",
          },
        },
      ],
      group_info: [
        {
          id: "nodeGroupInfo",
          type: "panels",
          group_info: [
            { id: "label", type: "controls", parameter_refs: ["label"] },
          ],
        },
      ],
    },
    resources: {},
  },
};

export default node;
