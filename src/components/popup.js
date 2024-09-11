import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid'

export default function Popup({ show = false, children }) {
    const [popup, setPopup] = useState(show);

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity duration-1000 backdrop-blur-sm ${popup ? ' opacity-100 ' : ' opacity-0 pointer-events-none'}`}
                onClick={() => setPopup(false)}
            ></div>
            <div className={`absolute z-50 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 py-8 px-5 bg-white rounded-md w-[25%] min-w-[320px] max-sm:w-full max-sm:top-1/2 max-sm:-translate-y-1/2 shadow-lg border-[1px] border-solid border-gray-200 ${popup ? 'block' : 'hidden'}`}>
            <button className='absolute right-2 top-2' onClick={() => setPopup(false)}><XMarkIcon className='size-6'></XMarkIcon></button>
                {children}
            </div>
        </>
    );
}