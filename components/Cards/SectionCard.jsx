import React from 'react';

export default function SectionCard({ title, items = [] }) {
    return (
        <div className="bg-white shadow rounded-lg p-2 mb-2">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-sm">{title}</h3>
                <button className="text-xs cursor-pointer text-blue-600 hover:underline">View All</button>
            </div>
            <ul className="space-y-3">
                {items?.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <img
                            src={item?.image}
                            alt={item?.title}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-sm font-medium">{item?.title}</p>
                            <p className="text-xs text-gray-500">{item?.subtitle}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
