import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import './table.css'

const Table = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);

  const fetchData = async () => {
    const start = (currentPage - 1) * perPage + 1;
    const end = start + perPage - 1;

    // Fetch data from your backend service
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${start}&_end=${end}`);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);


  const handleCheckboxChange = (event, id) => {
    if (event.target.checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>UserID</th>
            <th>Title</th>
            <th>Body</th>
            <th>Checkbox</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.userId}</td>
              <td>{item.title}</td>
              <td>{item.body}</td>
              <td>
                <input
                  type="checkbox"
                  onChange={(event) => handleCheckboxChange(event, item.id)}
                  checked={selectedRows.includes(item.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(100 / perPage);
    const pageNumbers = Array.from(Array(totalPages).keys()).map(num => num + 1);

    return (
      <div className="pagination">
        {pageNumbers.map(number => (
          <button key={number} onClick={() => handlePageChange(number)}>
            {number}
          </button>
        ))}
      </div>
    );
  };

  const renderBarChart = () => {
    const selectedData = data.filter(item => selectedRows.includes(item.id));
    const xValues = selectedData.map(item => item.title);
    const yValues = selectedData.map(item => item.id);

    return (
      <Plot
        data={[
          {
            type: 'bar',
            x: xValues,
            y: yValues,
          },
        ]}
        layout={{ width: 800, height: 400, title: 'Bar Chart Visualization' }}
      />
    );
  };

  return (
    <div className="Table">
      <h1>Data Table and Bar Chart Visualization</h1>
      {renderTable()}
      {renderPagination()}
      {selectedRows.length > 0 && renderBarChart()}
    </div>
  );
}

export default Table;
