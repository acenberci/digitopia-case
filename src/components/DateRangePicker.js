import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

const DateRangePicker = ({ onDateRangeChange }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [selectedRange, setSelectedRange] = useState("+Add");
    const pickerRef = useRef(null);
    const { t } = useTranslation('common');

    useEffect(() => {
        setSelectedRange(`+${t("add")}`)
    }, [])
    const handleSave = () => {
        const rangeText = formatDateRange();
        setSelectedRange(rangeText);
        onDateRangeChange(startDate, endDate);
        setShowPicker(false);
    };

    const formatDateRange = () => {
        if (startDate && endDate) {
            return `${format(startDate, 'MMM yyyy')} - ${format(endDate, 'MMM yyyy')}`;
        } else if (startDate) {
            return format(startDate, 'MMM yyyy');
        } else if (endDate) {
            return format(endDate, 'MMM yyyy');
        } else {
            return '+Add';
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className='flex flex-col items-center'>
                <h4>{t('duration')}</h4>
                <button
                    className='text-blue-600 w-fit mt-1 font-semibold'
                    onClick={() => setShowPicker(!showPicker)}
                >
                    {selectedRange}
                </button>
            </div>

            {
                showPicker && (
                    <div
                        ref={pickerRef}
                        className="absolute w-3/4 top-full left-1/2 -translate-x-1/2 mt-2 p-4 bg-white border rounded-2xl shadow-md max-w-sm text-center gap-2 flex flex-col z-50"
                    >
                        <div className='flex items-center gap-1'>
                            <div>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText={t("startDate")}
                                    className="w-full px-3 py-2 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-300 placeholder:text-black"
                                />
                            </div>
                            <hr className='w-10 border-y border-gray-400'></hr>
                            <div>
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText={t("endDate")}
                                    className="w-full px-3 py-2 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-300 placeholder:text-black"
                                />
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <button
                                onClick={() => setShowPicker(false)}
                                className="w-fit py-2 px-4 text-red-400 font-semibold text-lg hover:text-red-800"
                            >
                                {t("cancel")}
                            </button>
                            <button
                                onClick={handleSave}
                                className="w-fit py-2 px-8 bg-blue-500 font-semibold text-lg text-white rounded-2xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {t("ok")}
                            </button>
                        </div>
                    </div>

                )
            }
        </>
    );
};

export default DateRangePicker;
