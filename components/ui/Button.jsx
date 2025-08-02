import React from 'react';

const Button = ({
    onClick,
    disabled = false,
    type = 'button',
    variant = 'primary',
    className = '',
    children,
}) => {
    const baseClasses =
        'px-5 py-2 rounded-md font-semibold transition duration-200 text-sm shadow-sm cursor-pointer';

    const variants = {
        primary: 'bg-[#000F5C] text-white hover:bg-[#00136e]',
        secondary: 'bg-[#4177C2] text-white hover:bg-[#3365ac]',
        dark: 'bg-[#0F0F19] text-white hover:bg-[#1a1a28]',
        neutral: 'bg-[#444B5C] text-white hover:bg-[#555e70]',
        outline: 'border border-[#000F5C] text-[#000F5C] hover:bg-[#000F5C] hover:text-white',
    };

    const disabledClasses = 'bg-[#cccccc] text-white cursor-not-allowed';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${disabled ? disabledClasses : variants[variant]
                } ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
