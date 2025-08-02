import React from 'react';

const TextField = ({ label, type = 'text', value, onChange, name, placeholder }) => {
    return (
        <div className="relative w-full mb-6">
            <label
                htmlFor={name}
                className="absolute -top-2.5 left-3 bg-white px-1 text-sm text-gray-500 z-10"
            >
                {label}
            </label>
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-md px-4 py-2 pt-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#000F5C] focus:border-transparent transition"
            />
        </div>
    );
};

export default TextField;
