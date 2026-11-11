import "./table.css";
interface TableProps {
  headers: Record<string, React.ReactNode>;
  data: Record<string, React.ReactNode>[];
  onClickRow?: (row: number) => void;
  onClickHeader?: (col: number) => void;
  rowHeader?: string;
  className?: string;
}

function Table({
  headers,
  rowHeader,
  data,
  onClickRow,
  onClickHeader,
  className = "",
}: TableProps) {
  const keys = Object.keys(headers);

  if (!data || data.length === 0) {
    return <div>No data</div>;
  }
  return (
    <table className={className}>
      <thead>
        <tr>
          {rowHeader && <th></th>}
          {keys.map((key, index) => (
            <th
              key={index}
              onClick={() => onClickHeader && onClickHeader(index)}
              className={onClickHeader && "dark-hover-button"}
            >
              <div className="text-[1.5rem]">{headers[key]}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowNum) => (
          <tr
            key={rowNum}
            onClick={() => onClickRow && onClickRow(rowNum)}
            className={`${onClickRow && "dark-hover-button"} ${row.style}`}
          >
            {rowHeader && (
              <th>
                <div className="flex [justify-content:left] items-center text-[1.5rem] pr-2">
                  {row[rowHeader]}
                </div>
              </th>
            )}
            {keys.map((key, colNum) => (
              <td key={colNum}>
                <div className="flex items-stretch justify-center w-full h-full p-1">
                  <div className="flex justify-center items-center bg-[lightblue] rounded-2xl h-full w-full py-2 text-black">
                    {row[key]}
                  </div>
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export { Table };
