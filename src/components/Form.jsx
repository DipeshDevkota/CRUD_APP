import { useState, useEffect } from 'react';
import { assets } from '../assets/assets.js';
import validator from 'validator';
import Table from './Table.jsx';

const Form = () => {
  const [image, setImage] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('Nepal');
  const [records, setRecords] = useState([]);
  const [editPosition, setEditPosition] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    district: '',
    province: 'Province 1',
    country: 'Nepal',
    day: '',
    month: '',
    year: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});

  // Fetch countries from the API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    validateField(name, value); // Validate individual field
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'image/png') {
      setImage(file);
      setErrors(prevErrors => ({
        ...prevErrors,
        image: '' // Clear error if file is valid
      }));
      setSuccess(prevSuccess => ({
        ...prevSuccess,
        image: 'Image uploaded successfully!'
      }));
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        image: 'Only PNG images are allowed.'
      }));
      setSuccess(prevSuccess => ({
        ...prevSuccess,
        image: ''
      }));
    }
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    const newSuccess = { ...success };

    switch (name) {
      case 'name':
        if (!value) {
          newErrors.name = '❗ Name is required.';
          newSuccess.name = '';
        } else {
          newErrors.name = '';
          newSuccess.name = '✓ Looks good!';
        }
        break;

      case 'email':
        if (!value) {
          newErrors.email = '❗ Email is required.';
          newSuccess.email = '';
        } else if (!validator.isEmail(value)) {
          newErrors.email = '❗ Email format is invalid.';
          newSuccess.email = '';
        } else {
          newErrors.email = '';
          newSuccess.email = '✓ Valid email!';
        }
        break;

      case 'phone':
        if (!value) {
          newErrors.phone = '❗ Phone number is required.';
          newSuccess.phone = '';
        } else if (!/^\d{7,}$/.test(value)) {
          newErrors.phone = '❗ Phone number must be at least 7 digits long.';
          newSuccess.phone = '';
        } else {
          newErrors.phone = '';
          newSuccess.phone = '✓ Valid phone number!';
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    setSuccess(newSuccess);
  };

  const validateForm = () => {
    const newErrors = {};
    const { name, email, phone } = formData;

    if (!name) newErrors.name = '❗ Name is required.';
    if (!email) {
      newErrors.email = '❗ Email is required.';
    } else if (!validator.isEmail(email)) {
      newErrors.email = '❗ Email format is invalid.';
    }
    if (!phone) {
      newErrors.phone = '❗ Phone number is required.';
    } else if (!validator.isMobilePhone(phone)) {
      newErrors.phone = '❗ Phone number must be at least 7 digits long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const dataToSubmit = {
        ...formData,
        country: selectedCountry,
        image: image ? URL.createObjectURL(image) : null
      };

      if (editPosition !== null) {
        const updatedRecords = records.map((record, index) =>
          index === editPosition ? dataToSubmit : record
        );
        setRecords(updatedRecords);
        setEditPosition(null);
      } else {
        setRecords([...records, dataToSubmit]);
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        district: '',
        province: '',
        day: '',
        month: '',
        year: ''
      });
      setImage(null); // Clear the image after submission
    }
  };

  const handleEdit = (index) => {
    setEditPosition(index);
    setFormData(records[index]);
    setImage(null); // Reset image to avoid conflicts
  };

  const handleDelete = (index) => {
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
  };

  return (
    <div className="flex justify-center flex-col bg-slate-200">
      <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4">
        <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">User Information</h1>

          <label className="block mb-4 relative">
            <h1 className="text-gray-600 font-semibold mb-2">Name <span className="text-red-500">*</span></h1>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            {success.name && <p className="text-green-500 text-sm mt-1">{success.name}</p>}
          </label>

          <label className="block mb-4 relative">
            <h1 className="text-gray-600 font-semibold mb-2">Email <span className="text-red-500">*</span></h1>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            {success.email && <p className="text-green-500 text-sm mt-1">{success.email}</p>}
          </label>

          <label className="block mb-4 relative">
            <h1 className="text-gray-600 font-semibold mb-2">Phone Number <span className="text-red-500">*</span></h1>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            {success.phone && <p className="text-green-500 text-sm mt-1">{success.phone}</p>}
          </label>

          <div className="block mb-4">
            <h1 className="text-gray-600 font-semibold mb-2">Date of Birth</h1>
            <div className="flex space-x-4">
              <input
                type="number"
                name="day"
                value={formData.day}
                onChange={handleChange}
                className="w-1/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Day"
                max="31"
                min="1"
              />
              <input
                type="number"
                name="month"
                value={formData.month}
                onChange={handleChange}
                className="w-1/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Month"
                max="12"
                min="1"
              />
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-1/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Year"
                max="2024"
                min="1900"
              />
            </div>
          </div>

          <label className="block mb-4 relative">
            <h1 className="text-gray-600 font-semibold mb-2">City</h1>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your city"
            />
          </label>

          <label className="block mb-4 relative">
            <h1 className="text-gray-600 font-semibold mb-2">District</h1>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your district"
            />
          </label>

          <label className="block mb-4 relative">
            <h1 className="text-gray-600 font-semibold mb-2">Province</h1>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Province 1">Province 1</option>
              <option value="Province 2">Province 2</option>
              <option value="Bagmati Province">Bagmati Province</option>
              <option value="Gandaki Province">Gandaki Province</option>
              <option value="Lumbini Province">Lumbini Province</option>
              <option value="Karnali Province">Karnali Province</option>
              <option value="Sudurpashchim Province">Sudurpashchim Province</option>
            </select>
          </label>

          <label className="block mb-4 relative">
            <h1 className="text-gray-600 font-semibold mb-2">Country</h1>
            <select
              name="country"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {countries.map((country, index) => (
                <option key={index} value={country.name.common}>
                  {country.name.common}
                </option>
              ))}
            </select>
          </label>

          <label className="block mb-4">
            <h1 className="text-gray-600 font-semibold mb-2">Profile Picture</h1>
            <input
              type="file"
              accept="image/png"
              onChange={handleImageChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {image && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-full mx-auto"
                />
              </div>
            )}
            {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
            {success.image && <p className="text-green-500 text-sm mt-2">{success.image}</p>}
          </label>

          <button
            type="submit"
            className="bg-blue-500 text-white w-full p-3 rounded-lg mt-6 font-semibold"
          >
            {editPosition !== null ? 'Update Record' : 'Submit'}
          </button>
        </form>
      </div>

      <Table records={records} setRecords={setRecords} onEdit={handleEdit} />
    </div>
  );
};

export default Form;
