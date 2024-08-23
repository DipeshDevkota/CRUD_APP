import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets.js';
import validator from 'validator';

const Form = () => {
  const [image, setImage] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('Nepal');
  const [formData, setFormData] = useState({
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
      // Handle form submission
      console.log('Form submitted successfully with data:', formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
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
              max={new Date().getFullYear()}
              min="1900"
            />
          </div>
        </div>

        <div className="address mb-4">
          <label className="block mb-4">
            <h1 className="text-gray-600 font-semibold mb-2">City</h1>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter city"
            />
          </label>

          <label className="block mb-4">
            <h1 className="text-gray-600 font-semibold mb-2">District</h1>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter district"
            />
          </label>

          <label className="block mb-4">
            <h1 className="text-gray-600 font-semibold mb-2">Province</h1>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Province 1</option>
              <option>Province 2</option>
              <option>Province 3</option>
              <option>Province 4</option>
              <option>Province 5</option>
              <option>Province 6</option>
              <option>Province 7</option>
            </select>
          </label>

          <label className="block mb-4">
            <h1 className="text-gray-600 font-semibold mb-2">Country</h1>
            <select
              name="country"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {countries.map((country) => (
                <option key={country.cca3} value={country.name.common}>
                  {country.name.common}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-4">
  <p>Upload Image (PNG only)</p>
  <input
    onChange={handleImageChange}
    type="file"
    id="image"
    accept="image/png"
    hidden
  />
  <label htmlFor="image">
    <img
      src={image ? URL.createObjectURL(image) : assets.upload_area}
      className="w-24 cursor-pointer"
      alt="Upload Image"
    />
  </label>
  {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
  {success.image && <p className="text-green-500 text-sm mt-1">{success.image}</p>}
</div>

        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
