import "./table.css"
export default function Table(
    {
        headers,
        data,
        onClickRow,
    }:{
        headers: any,
        data: any[],
        onClickRow?: (row:number) => void;
    }
){
    const keys = Object.keys(headers)

    if(!data || data.length === 0){
        return <div>No data</div>
    }
    return (
        <table className="leaderboard-table">
            <thead>
                <tr>
                    <th></th>
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
                {data.map((row) => (
                    <tr key={row.rank} onClick = {() => onClickRow && onClickRow(row.rank)} className={onClickRow && "dark-hover-button"}>
                        <th><div className="leaderboard-table-position">#{row.rank}</div></th>
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