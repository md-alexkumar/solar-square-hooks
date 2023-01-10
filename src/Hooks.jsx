import React, { useState, useEffect, useCallback } from "react";

export default function Hooks() {
  const [showPreview, setShowPreview] = useState(false);
  const [panelData, setPanelData] = useState([]);
  const initialPanelData = [
    [
      { key: 0, selected: false },
      { key: 1, selected: false },
      { key: 2, selected: false },
      { key: 3, selected: false },
    ],
    [
      { key: 0, selected: false },
      { key: 1, selected: false },
      { key: 2, selected: false },
      { key: 3, selected: false },
    ],
    [
      { key: 0, selected: false },
      { key: 1, selected: false },
      { key: 2, selected: false },
      { key: 3, selected: false },
    ],
    [
      { key: 0, selected: false },
      { key: 1, selected: false },
      { key: 2, selected: false },
      { key: 3, selected: false },
    ],
  ];
  const handleOutsideClick = useCallback(
    (e) => {
      if (!document.getElementById("solar-container").contains(e.target)) {
        if (!panelData.length) {
          setPanelData(initialPanelData);
        }
      }
    },
    [initialPanelData, panelData]
  );
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  const resetPanel = () => {
    setPanelData(initialPanelData);
  };
  const togglePanelView = () => {
    setShowPreview((prevPreview) => !prevPreview);
  };

  const onCellClick = (rowIdx, columnIdx) => {
    if (!showPreview) {
      const lastColumnIdx = panelData[0].length - 1;
      const lastRowIdx = panelData.length - 1;
      if (rowIdx === 0) {
        if (columnIdx === 0) {
          const updatedPanel = addOneLeftColumn(rowIdx);
          const newTopRow = getNewRow(updatedPanel[0].length);
          setPanelData([newTopRow, ...updatedPanel]);
        } else if (columnIdx === lastColumnIdx) {
          const updatedPanel = addOneRightColumn(rowIdx);
          const newTopRow = getNewRow(updatedPanel[0].length);
          setPanelData([newTopRow, ...updatedPanel]);
        } else {
          const updatedPanel = updateSelectedRow(rowIdx, columnIdx);
          const newTopRow = getNewRow(updatedPanel[0].length);
          setPanelData([newTopRow, ...updatedPanel]);
        }
      } else if (rowIdx === lastRowIdx) {
        if (columnIdx === 0) {
          const updatedPanel = addOneLeftColumn(rowIdx);
          const newBottomRow = getNewRow(updatedPanel[0].length);
          setPanelData([...updatedPanel, newBottomRow]);
        } else if (columnIdx === lastColumnIdx) {
          const updatedPanel = addOneRightColumn(rowIdx);
          const newBottomRow = getNewRow(updatedPanel[0].length);
          setPanelData([...updatedPanel, newBottomRow]);
        } else {
          const updatedPanel = updateSelectedRow(rowIdx, columnIdx);
          const newBottomRow = getNewRow(updatedPanel[0].length);
          setPanelData([...updatedPanel, newBottomRow]);
        }
      } else {
        if (columnIdx === 0) {
          const updatedPanel = addOneLeftColumn(rowIdx);
          setPanelData([...updatedPanel]);
        } else if (columnIdx === lastColumnIdx) {
          const updatedPanel = addOneRightColumn(rowIdx);
          setPanelData([...updatedPanel]);
        } else {
          const updatedPanel = updateSelectedRow(rowIdx, columnIdx);
          setPanelData([...updatedPanel]);
        }
      }
    }
  };
  const updateSelectedRow = (rowIdx, columnIdx) => {
    const updateData = [...panelData];
    let selectedRowData = [...updateData[rowIdx]];
    selectedRowData[columnIdx] = {
      ...selectedRowData[columnIdx],
      selected: !selectedRowData[columnIdx].selected,
    };
    updateData[rowIdx] = selectedRowData;
    return updateData;
  };
  const getNewRow = (panelLength) => {
    return Array.from(Array(panelLength), (_, i) => ({
      key: i,
      selected: false,
    }));
  };
  const addOneRightColumn = (rowIdx) => {
    return panelData.map((panel, idx) => {
      const panelInfo = [...panel];
      const lastCellData = panelInfo[panelInfo.length - 1];
      panelInfo.splice(
        -1,
        1,
        ...[
          {
            ...lastCellData,
            selected:
              idx === rowIdx ? !lastCellData.selected : lastCellData.selected,
          },
          { key: panelInfo.length, selected: false },
        ]
      );
      return panelInfo;
    });
  };
  const addOneLeftColumn = (rowIdx) => {
    return panelData.map((panel, idx) => {
      const panelInfo = [...panel];
      const firstCellData = panelInfo[panelInfo.length - 1];
      panelInfo.splice(
        0,
        1,
        ...[
          { key: panelInfo.length, selected: false },
          {
            ...firstCellData,
            selected:
              idx === rowIdx ? !firstCellData.selected : firstCellData.selected,
          },
        ]
      );
      return panelInfo;
    });
  };
  return (
    <>
      {panelData.length ? (
        <div className="justify-content-center p-3">
          <button className="btn btn-primary" onClick={togglePanelView}>
            {showPreview ? "Back to design" : "Final Design"}
          </button>
          {!showPreview ? (
            <button className="btn btn-danger ml-2" onClick={resetPanel}>
              Reset
            </button>
          ) : null}
        </div>
      ) : null}
      <div id="solar-container" className="flex-column center">
        {!panelData.length ? (
          <div className="center">
            Click anywhere to construct initial panel..
          </div>
        ) : (
          <>
            {panelData.map((panelRow, rowIdx) => (
              <div key={rowIdx} className="flex-row">
                {panelRow.map((panelColumn, columnIdx) => (
                  <div
                    key={columnIdx}
                    onClick={() => onCellClick(rowIdx, columnIdx)}
                    className={`solar-box center ${
                      panelColumn.selected && "selected-panel"
                    } ${!showPreview && "solar-box-border edit-design"}`}
                  ></div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
