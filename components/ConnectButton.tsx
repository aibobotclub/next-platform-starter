import React, { useState } from 'react';
import Image from 'next/image';

interface ConnectButtonProps {
    logo: string;
    description: string; 
    onFocusChange: (isFocused: boolean) => void; 
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ logo, description, onFocusChange }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
        onFocusChange(true); 
    };

    const handleBlur = () => {
        setIsFocused(false);
        onFocusChange(false); 
    };

    return (
        <button
            className='bg-white ring-2 hover:bg-white rounded-md ring-slate-100 focus:ring-2 focus:ring-orange-300 w-[320px] md:w-[400px]'
            onFocus={handleFocus}
            onBlur={handleBlur}
        >
            <div className='flex justify-between p-2'>
                <div className='flex items-center'>
                    <Image src={logo} alt={`${description} logo`} width={20} height={20} />
                    <span className='font-normal text-black ml-2'>{description}</span>
                </div>
                
                {isFocused && (
                    <button className='text-white bg-colors-ButtonOrange text-xs rounded-full hover:bg-orange-300 p-1'>
                        Connect
                    </button>
                )}
            </div>
        </button>
    );
};

export default ConnectButton;
