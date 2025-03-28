import "./leaderboard.css"
export default function Table(
    {
        headers,
        data,
        start = 1,
        onClickRow,
    }:{
        headers: any,
        data: any[],
        start?: number,
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
                {data.map((row,index) => (
                    <tr key={row.rank} onClick = {() => onClickRow && onClickRow(row.rank)}>
                        <th><div className="leaderboard-table-position">#{row.rank}</div></th>
                        {keys.map((key,colNum) => (
                            <td key={colNum}>
                                <div className="leaderboard-table-cell-wrapper">
                                    <div className="leaderboard-table-cell">
                                        {row[key].stat}{row[key].unit && <span>{row[key].unit}</span>}
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