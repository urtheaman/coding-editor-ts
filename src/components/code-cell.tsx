import { useEffect } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import Resizable from "./resizable";
import { Cell } from "../state/cell.type";
import { useActions } from "../hooks/use-actions";
import { useTypedSelector } from "../hooks/use-typed-selector";
import "./code-cell.css";
import { useCumulativeCode } from "../hooks/use-cumulative-code";

type Props = {
  cell: Cell;
};

const CodeCell: React.FC<Props> = ({ cell }) => {
  const { id } = cell;
  const { updateCell, createBundle } = useActions();
  const bundled = useTypedSelector(({ bundles }) => bundles?.[cell.id]);
  const cumulativeCode = useCumulativeCode(id);

  useEffect(() => {
    if (!bundled) {
      createBundle(id, cumulativeCode);
      return;
    }

    const timer = setTimeout(async () => {
      createBundle(id, cumulativeCode);
    }, 750);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode, id, createBundle]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue="const a = 1;"
            onChange={(value) => updateCell(id, value)}
          />
        </Resizable>
        <div className="progress-wrapper">
          {bundled && !bundled.bundling ? (
            <Preview code={bundled.code} err={bundled.err} />
          ) : (
            <div className="progress-cover">
              <progress className="progress is-small" max="100">
                Loading
              </progress>
            </div>
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
