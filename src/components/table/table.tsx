import "./table.css"
export default function Table(
    {
        headers,
        rowHeader,
        data,
        onClickRow,
        className,
    }:{
        headers: any,
        data: any[],
        onClickRow?: (row:number) => void;
        rowHeader?: string;
        className?: string;
    }
){
    const keys = Object.keys(headers)

    if(!data || data.length === 0){
        return <div>No data</div>
    }
    return (
        <table className={`leaderboard-table ${className}`}>
            <thead>
                <tr>
                    {rowHeader && <th></th>}
                    {keys.map((key,index) => (
                        <th key={index}>
                            <div className="leaderboard-table-header">
                                {headers[key]}
                            </div>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row,rowNum) => (
                    <tr key={rowNum} onClick = {() => onClickRow && onClickRow(rowNum)} className={onClickRow && "dark-hover-button"}>
                        {rowHeader && <th><div className="leaderboard-table-position">{row[rowHeader]}</div></th>}
                        {keys.map((key,colNum) => (
                            <td key={colNum}>
                                <div className="leaderboard-table-cell-wrapper">
                                    <div className="leaderboard-table-cell">
                                        {row[key]}
                                    </div>
                                </div>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}