import './Table.scss';

const Table = ({ headers = [], children, caption }) => {
     return (
         <div className="table-wrapper">
             <table className="table">
                 {caption && <caption className="table__caption">{caption}</caption>}
                 <thead className="table__head">
                 <tr>
                     {headers.map((header, index) => (
                         <th key={index} scope="col" className="table__th">
                             {header}
                         </th>
                     ))}
                 </tr>
                 </thead>
                 <tbody className="table__body">{children}</tbody>
             </table>
         </div>
     );
};

export default Table;