import { hasValue, toPrettyString } from "./utils";

interface Props {
  error?: string;
  properties: {
    label: string;
    value: any;
  }[];
}

function NodeTooltip({ error, properties }: Props) {
  return (
    <div className="elyra-PipelineNodeTooltip">
      {error && (
        <div className="elyra-tooltipError">
          <div className="elyra-tooltipKey">Error</div>
          <div className="elyra-tooltipValue">{toPrettyString(error)}</div>
        </div>
      )}
      {properties
        .filter(({ value }) => hasValue(value))
        .map(({ label, value }) => (
          <div key={label}>
            <div className="elyra-tooltipKey">{label}</div>
            <div className="elyra-tooltipValue">{toPrettyString(value)}</div>
          </div>
        ))}
    </div>
  );
}

export default NodeTooltip;
