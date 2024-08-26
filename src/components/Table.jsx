import React, { useState, useEffect } from 'react';

const Table = ({ records, setRecords, onEdit }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const recordsPerPage = 5;

  useEffect(() => {
    const storedRecords = JSON.parse(localStorage.getItem('records'));
    if (storedRecords) {
      setRecords(storedRecords);
    }
  }, [setRecords]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (field) => {
    const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  const filteredRecords = records.filter((record) =>
    record.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);

  const handleDelete = (index) => {
    const updatedRecords = records.filter((_, i) => i !== indexOfFirstRecord + index);
    setRecords(updatedRecords);
    localStorage.setItem('records', JSON.stringify(updatedRecords));

    if (currentPage > 1 && currentRecords.length === 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="mt-7">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[20vh] ml-[70vh] flex text-slate-500 font-semibold justify-center items-center">Records</h2>
        <input
          type="text"
          placeholder="Search by Name"
          value={searchQuery}
          onChange={handleSearch}
          className="border rounded-lg px-9 w-72 py-4 mr-36 mt-14"
        />
      </div>

      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr>
            <th className="py-4 cursor-pointer bg-slate-200" onClick={() => handleSort('name')}>
              Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-4 cursor-pointer bg-slate-300" onClick={() => handleSort('email')}>
              Email {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-4 cursor-pointer bg-slate-300" onClick={() => handleSort('phone')}>
              Phone {sortField === 'phone' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-4 cursor-pointer bg-slate-300" onClick={() => handleSort('day')}>
              DOB {sortField === 'day' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-4 bg-slate-300">Address</th>
            <th className="py-4 bg-slate-300">Image</th>
            <th className="py-4 bg-slate-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((record, index) => (
            <tr key={index} className="text-center">
              <td className="py-2">{record.name}</td>
              <td className="py-2">{record.email}</td>
              <td className="py-2">{record.phone}</td>
              <td className="py-2">{`${record.day}/${record.month}/${record.year}`}</td>
              <td className="py-2">{`${record.city}, ${record.district}, ${record.province}, ${record.country}`}</td>
              <td className="py-2">
                {record.image && (
                  <img
                    src={record.image}
                    alt="Uploaded"
                    className="w-16 h-16 object-cover mx-auto rounded-full"
                  />
                )}
              </td>
              <td className="py-2">
                <button
                  onClick={() => onEdit(indexOfFirstRecord + index)}
                  className="bg-green-400 hover:bg-slate-400 text-white px-4 py-2 rounded-lg mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-gray-400 text-gray-700 px-10 py-6 hover:bg-lime-50 cursor-pointer rounded-lg text-3xl ml-10 mb-10 mt-7"
        >
          Previous
        </button>
        <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-400 text-gray-700 px-10 py-6 hover:bg-lime-50 cursor-pointer rounded-lg text-3xl mr-10 mb-10 mt-7"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
