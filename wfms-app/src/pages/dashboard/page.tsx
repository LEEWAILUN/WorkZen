import React, { useState } from 'react';
import './dashboard.css';
import Sidebar from '../../components/navigation/sidebar/navigation';
import ChatSuggestion from '../../components/floating/chat';

interface TableData {
  name: string;
  headers: string[];
  data: { level: number; cells: string[]; expanded: boolean }[];
}

interface DashboardData {
  dashboardName: string;
  tables: TableData[];
}

interface DashboardProps {
  initialData: DashboardData;
}

const DashboardPage = ({ initialData }: DashboardProps) => {
  const [dashboardName, setDashboardName] = useState(
    initialData?.dashboardName || "Dashboard"
  );
  const [tables, setTables] = useState<TableData[]>(initialData?.tables || []);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);

  const addTable = () => {
    setTables((prevTables) => [
      ...prevTables,
      {
        name: `Table ${prevTables.length + 1}`,
        headers: ["Task", "Priority", "Deadline"],
        data: [{ level: 1, cells: ["", "", ""], expanded: false }],
      },
    ]);
  };

  const toggleExpand = (tableIndex: number, rowIndex: number) => {
    setTables((prevTables) => {
      const newTables = [...prevTables];
      newTables[tableIndex].data[rowIndex].expanded =
        !newTables[tableIndex].data[rowIndex].expanded;
      return [...newTables];
    });
  };

  const addSubTask = (tableIndex: number, parentIndex: number) => {
    setTables((prevTables) => {
      const newTables = [...prevTables];
      const parentTask = newTables[tableIndex].data[parentIndex];

      if (parentTask.level < 4 && parentTask.cells.some((cell) => cell.trim() !== "")) {
        newTables[tableIndex].data.splice(parentIndex + 1, 0, {
          level: parentTask.level + 1,
          cells: newTables[tableIndex].headers.map(() => ""),
          expanded: false,
        });
      }
      return [...newTables];
    });
  };

  const removeTable = (tableIndex: number) => {
    setTables((prevTables) => prevTables.filter((_, index) => index !== tableIndex));
  };

  const addRow = (tableIndex: number) => {
    setTables((prevTables) =>
      prevTables.map((table, index) => {
        if (index === tableIndex) {
          return {
            ...table,
            data: [
              ...table.data,
              {
                level: 1,
                cells: table.headers.map(() => ""),
                expanded: false,
              },
            ],
          };
        }
        return table;
      })
    );
  };  

  const removeRow = (tableIndex: number, rowIndex: number) => {
    setTables((prevTables) => {
      const newTables = [...prevTables];
      if (newTables[tableIndex].data.length > 1) {
        newTables[tableIndex].data.splice(rowIndex, 1);
      }
      return [...newTables];
    });
  };

  const addColumn = (tableIndex: number) => {
    setTables((prevTables) => {
      const newTables = [...prevTables];
      newTables[tableIndex] = {
        ...newTables[tableIndex],
        headers: [
          ...newTables[tableIndex].headers,
          `Column ${newTables[tableIndex].headers.length + 1}`,
        ],
        data: newTables[tableIndex].data.map((row) => ({
          ...row,
          cells: [...row.cells, ""],
        })),
      };
      return [...newTables];
    });
  };

  const removeColumn = (tableIndex: number, colIndex: number) => {
    setTables((prevTables) => {
      const newTables = [...prevTables];
      if (newTables[tableIndex].headers.length > 1) {
        newTables[tableIndex] = {
          ...newTables[tableIndex],
          headers: newTables[tableIndex].headers.filter((_, i) => i !== colIndex),
          data: newTables[tableIndex].data.map((row) => ({
            ...row,
            cells: row.cells.filter((_, i) => i !== colIndex),
          })),
        };
      }
      return [...newTables];
    });
  };

  const updateCell = (tableIndex: number, rowIndex: number, colIndex: number, value: string) => {
    setTables((prevTables) => {
      const newTables = [...prevTables];
      newTables[tableIndex].data[rowIndex].cells[colIndex] = value;
      return [...newTables];
    });
  };

  const updateHeader = (tableIndex: number, colIndex: number, value: string) => {
    setTables((prevTables) => {
      const newTables = [...prevTables];
      newTables[tableIndex].headers[colIndex] = value;
      return [...newTables];
    });
  };

  return (
    <div className="app-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="dashboard-container">
        <input
          type="text"
          value={dashboardName}
          onChange={(e) => setDashboardName(e.target.value)}
          className="dashboard-name"
        />
        <button onClick={addTable} className="add-table-btn">
          + Add Table
        </button>

        {tables.map((table, tableIndex) => (
          <div key={tableIndex} className="table-wrapper">
            <div className="table-header">
              <input
                type="text"
                value={table.name}
                onChange={(e) => {
                  setTables((prevTables) => {
                    const newTables = [...prevTables];
                    newTables[tableIndex].name = e.target.value;
                    return newTables;
                  });
                }}
                className="table-name"
              />
              <button onClick={() => { 
                setSelectedTable({ ...table }); 
                setChatOpen(true); 
              }}>
                📊 Analyze Table
              </button>

              <button onClick={() => removeTable(tableIndex)} className="remove-table-btn">
                🗑️
              </button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    {table.headers.map((header, colIndex) => (
                      <th key={colIndex}>
                        <input
                          type="text"
                          value={header}
                          onChange={(e) => updateHeader(tableIndex, colIndex, e.target.value)}
                        />
                        <div className="column-actions">
                          <button className="column-menu-btn">⋮</button>
                          <div className="column-menu-dropdown">
                            <button onClick={() => removeColumn(tableIndex, colIndex)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.data.map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      <tr style={{ paddingLeft: `${row.level * 20}px` }}>
                        <td>
                          <button
                            onClick={() => toggleExpand(tableIndex, rowIndex)}
                            className="expand-collapse-btn"
                          >
                            {row.expanded ? '▼' : '▶'}
                          </button>
                          <input
                            type="text"
                            value={row.cells[0]}
                            onChange={(e) => updateCell(tableIndex, rowIndex, 0, e.target.value)}
                          />
                        </td>
                        {row.cells.slice(1).map((cell, colIndex) => (
                          <td key={colIndex}>
                            <input
                              type={table.headers[colIndex + 1]?.toLowerCase() === "deadline" ? "date" : "text"}
                              value={cell}
                              onChange={(e) => updateCell(tableIndex, rowIndex, colIndex + 1, e.target.value)}
                            />
                          </td>
                        ))}
                        <td>
                          <button
                            onClick={() => removeRow(tableIndex, rowIndex)}
                            className="remove-row-btn"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                      {row.expanded && (
                        <tr>
                          <td colSpan={table.headers.length + 1}>
                            <button
                              onClick={() => addSubTask(tableIndex, rowIndex)}
                              className="add-subtask-btn"
                            >
                              + Add Sub-Task
                            </button>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-actions">
              <button onClick={() => addRow(tableIndex)} className="add-row-btn">
                + Row
              </button>
              <button onClick={() => addColumn(tableIndex)} className="add-column-btn">
                + Column
              </button>
            </div>
          </div>
        ))}
          <button className="floating-chat-btn" onClick={() => setChatOpen(true)}>
          💬
        </button>

        {chatOpen && (
          <div className="floating-chat-window">
            <button className="close-chat-btn" onClick={() => setChatOpen(false)}>✖</button>
            {selectedTable && <ChatSuggestion selectedTable={selectedTable} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;