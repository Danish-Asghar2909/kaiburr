import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import './table.css'

const Table = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    if (data.length > 0) {
      const initialSelectedRows = data.slice(0, 5).map(item => item.id);
      setSelectedRows(initialSelectedRows);
    }
  }, [data]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter(item => {
    const { id, userId, title, body } = item;
    const searchTerm = searchQuery.toLowerCase();
    return (
      id.toString().includes(searchTerm) ||
      userId.toString().includes(searchTerm) ||
      title.toLowerCase().includes(searchTerm) ||
      body.toLowerCase().includes(searchTerm)
    );
  });

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

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const renderTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Checkbox</th>
            <th>ID</th>
            <th>UserID</th>
            <th>Title</th>
            <th>Body</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>
                <input
                  type="checkbox"
                  onChange={(event) => handleCheckboxChange(event, item.id)}
                  checked={selectedRows.includes(item.id)}
                />
              </td>
              <td>{item.id}</td>
              <td>{item.userId}</td>
              <td>{item.title}</td>
              <td>{item.body}</td>
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
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button onClick={handleClearSearch}>Clear</button>
      </div>
      {renderTable()}
      {renderPagination()}
      {selectedRows.length > 0 && renderBarChart()}
    </div>
  );
}

export default Table;
