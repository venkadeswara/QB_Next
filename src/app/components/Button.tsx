import React from 'react';

interface GenericButtonProps {
    text: React.ReactNode;
    onClick: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    color?: 'blue' | 'grey' | 'metablue' | 'red' | 'green'|'mildgreen'|'rockblue';
    [key: string]: any;
}

const GenericButton: React.FC<GenericButtonProps> = ({
    text,
    onClick,
    type = 'button',
    className = '',
    color = 'blue',
    ...props
}) => {
    let buttonColorClass = 'bg-blue-500';
    switch (color) {
        case 'grey':
            buttonColorClass = 'bg-[#566573]';
            break;
        case 'metablue':
            buttonColorClass = 'bg-[#587d90]';
            break;
        case 'red':
            buttonColorClass = 'bg-[#d9534f]';
            break;
        case 'green':
            buttonColorClass = 'bg-green-700';
            break;  
        case 'mildgreen':
                buttonColorClass = 'bg-[#b9cbba]';
                break; 
        case 'rockblue':
                buttonColorClass = 'bg-[#98AFC7]';
                break;  
        default:
            buttonColorClass = 'bg-blue-500';
            break;
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-4 py-2 text-gray-600 font-medium rounded ${buttonColorClass} ${className}`}
            {...props}>
            {text}
        </button>
    );
};

export default GenericButton;
