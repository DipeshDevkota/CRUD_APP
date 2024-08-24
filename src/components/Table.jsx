import React from 'react';

const Table = ({ records, setRecords, onEdit }) => {
  const handleDelete = (index) => {
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm font-light bg-white border border-gray-200 shadow-md">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-6 py-4 font-medium text-gray-900">Name</th>
            <th className="px-6 py-4 font-medium text-gray-900">Email</th>
            <th className="px-6 py-4 font-medium text-gray-900">Phone</th>
            <th className="px-6 py-4 font-medium text-gray-900">DOB</th>
            <th className="px-6 py-4 font-medium text-gray-900">City</th>
            <th className="px-6 py-4 font-medium text-gray-900">District</th>
            <th className="px-6 py-4 font-medium text-gray-900">Province</th>
            <th className="px-6 py-4 font-medium text-gray-900">Country</th>
            <th className="px-6 py-4 font-medium text-gray-900">Image</th>
            <th className="px-6 py-4 font-medium text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
                No records found.
              </td>
            </tr>
          ) : (
            records.map((record, index) => (
              <tr key={index} className="border-b hover:bg-gray-100 transition">
                <td className="px-6 py-4 text-gray-800">{record.name}</td>
                <td className="px-6 py-4 text-gray-800">{record.email}</td>
                <td className="px-6 py-4 text-gray-800">{record.phone}</td>
                <td className="px-6 py-4 text-gray-800">{`${record.day}-${record.month}-${record.year}`}</td>
                <td className="px-6 py-4 text-gray-800">{record.city}</td>
                <td className="px-6 py-4 text-gray-800">{record.district}</td>
                <td className="px-6 py-4 text-gray-800">{record.province}</td>
                <td className="px-6 py-4 text-gray-800">{record.country}</td>
                <td className="px-6 py-4 text-gray-800">
                  {record.image && (
                    <img
                      src={record.image}
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onEdit(index)}
                    className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
