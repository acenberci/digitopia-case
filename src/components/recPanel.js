import React, { useContext, useEffect, useState } from 'react';
import { PlusIcon, ArrowDownLeftIcon } from '@heroicons/react/24/solid';
import { HelperContext } from '@/helpers/HelperContext';
import { useTranslation } from 'react-i18next';
import DateRangePicker from './DateRangePicker';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from "yup";


export default function RecPanel() {
    const { panelCollapsed, setPanelCollapsed, rightBar, setRightBar, setTasks, dateRange, setDateRange } = useContext(HelperContext);
    const [save, setSave] = useState(false);
    const [content, setContent] = useState();
    const { t, i18n } = useTranslation('common');
    const [recommendations, setRecommendations] = useState([
        {
            tittle: "Process Improvement Strategies",
            content: "Explore ways to optimize your internal processes to enhance efficiency. These strategies can help you save time and costs."
        },
        {
            tittle: "Customer Satisfaction Enhancement",
            content: "Learn how to improve your products and services using customer feedback. Practical suggestions to increase satisfaction levels."
        },
        {
            tittle: "Digital Transformation Strategies",
            content: "Discover how to modernize your business processes with digital tools. Benefits of digital transformation and practical solutions."
        },
        {
            tittle: "Strengthening Team Communication",
            content: "Effective methods to improve communication between team members. Strategies to facilitate collaboration and information sharing."
        },
        {
            tittle: "Innovative Product Development",
            content: "Strategies for generating new product ideas and successfully launching them. Approaches to gain a competitive advantage through innovation."
        },
        {
            tittle: "Risk Management and Mitigation",
            content: "Identify and manage risks in your business processes. Measures to reduce risks and protect your business."
        },
        {
            tittle: "Sustainability and Eco-Friendly Practices",
            content: "Information on eco-friendly practices and sustainable business strategies. How to reduce your environmental impact."
        },
        {
            tittle: "Financial Management Tips",
            content: "Effective ways to manage financial resources and budgeting strategies. Tips for improving the financial health of your business."
        },
        {
            tittle: "Market Research and Trend Analysis",
            content: "Methods for conducting market research and tracking trends. How to strengthen your business strategy with this information."
        },
        {
            tittle: "Investment Strategies and Innovation",
            content: "Information on directing investments and fostering innovation. Ways to enhance your business's growth potential."
        },
        {
            tittle: "Customer Relationship Management",
            content: "Strategies for effectively managing customer relationships and building long-term connections. Tips to increase customer loyalty."
        },
        {
            tittle: "Employee Development and Training Programs",
            content: "Strategies for developing employees' skills and creating training programs. Ways to enhance the competency of your workforce."
        },
        {
            tittle: "Supply Chain Management",
            content: "Strategies for optimizing your supply chain processes and reducing costs. Tips for improving efficiency."
        },
        {
            tittle: "Technology Investments and Infrastructure",
            content: "Ways to strengthen your technological infrastructure and invest in technology. Strategies to boost your business's digital capabilities."
        },
        {
            tittle: "Innovative Business Models",
            content: "Ways to create innovative business models and gain a competitive edge. Strategies to differentiate your business."
        },
        {
            tittle: "International Market Expansion",
            content: "Strategies for exploring opportunities in international markets and expanding globally. Ways to succeed in the global marketplace."
        },
        {
            tittle: "Social Media and Digital Marketing",
            content: "Strategies to enhance your brand using social media and digital marketing. Effective campaign and content suggestions."
        }
    ]);
    const SignInSchema = Yup.object().shape({
        tittle: Yup.string().min(3)
            .required(null),
        content: Yup.string()
            .min(3)
    });
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (i18n.isInitialized) {
            setIsReady(true);
        } else {
            const handle = () => {
                if (i18n.isInitialized) {
                    setIsReady(true);
                }
            };
            i18n.on('languageChanged', handle);
            return () => i18n.off('languageChanged', handle);
        }
    }, [i18n]);

    const handleDateRangeChange = (startDate, endDate) => {
        setRightBar(prev => ({ ...prev, render: !prev.render }));
        setDateRange(prev => ({
            ...prev,
            startDate: startDate,
            endDate: endDate
        }));
    };

    function saveRec(a) {
        if (dateRange && dateRange.startDate && dateRange.endDate) {
            setTasks(prev => [
                ...prev,
                { task: a.tittle, startDate: dateRange.startDate, endDate: dateRange.endDate }
            ]);
            setRightBar(prev => ({ ...prev, content: prev.content, isOpen: false }));
        } else {
            alert('Please select a valid date range.');
        }
    }

    useEffect(() => {
        if (save) {
            saveRec(content);
            setSave(false);
        }
    }, [save, content]);

    function RecRightBar(a) {
        setContent(a);
        setRightBar({
            content: (
                <div className='flex flex-col gap-5 h-full'>
                    <div className='p-1 bg-blue-500 text-sm w-fit text-white rounded-md'>
                        Operations - Internal Processes
                    </div>
                    <h4 className='font-bold text-md'>{a.tittle}</h4>
                    <div className='flex flex-row justify-between text-sm font-bold relative'>
                        <div className='flex flex-col items-center'>
                            <h4>CAPEX</h4>
                            <div className='px-3 py-1 rounded-xl bg-blue-300 text-blue-600 w-fit font-semibold'>$</div>
                        </div>
                        <div className='flex flex-col items-center'>
                            <h4>OPEX</h4>
                            <div className='px-3 py-1 rounded-xl bg-blue-300 text-blue-600 w-fit font-semibold'>$</div>
                        </div>
                        <div className='flex flex-col items-center'>
                            <h4>{t('size')}</h4>
                            <h4 className='mt-1 font-semibold'>Project</h4>
                        </div>
                        <div className='flex flex-col items-center'>
                            <DateRangePicker onDateRangeChange={handleDateRangeChange} />
                        </div>
                    </div>
                    <div className='bg-gray-200 rounded-md p-2 text-sm'>
                        {a.content}
                    </div>
                    <div className='mt-auto border-t pt-3 flex justify-end'>
                        <button onClick={() => setSave(true)} className='bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl'>
                            {t("save")}
                        </button>
                    </div>
                </div>
            ),
            tittle: <h4 className='font-bold text-lg'>{t('recommendationDetails')}</h4>,
            isOpen: true
        });
    }
    function createNewRec() {
        setRightBar({
            content: <div className='flex h-full w-full'>
            <Formik initialValues={{ tittle: "", content: "" }}
                validationSchema={SignInSchema}
                onSubmit={(values, { resetForm })=>{
                    setRecommendations(prev=>[...prev,{tittle:values.tittle,content:values.content}])
                    setRightBar(prev => ({ ...prev, content: prev.content, isOpen: false }));
                    setTimeout(() => {
                        resetForm()
                    }, 1000)
                }}>
                <Form className='w-full flex h-full flex-col'>
                    <div className='w-full'>
                        <label className='block text-sm text-gray-500'>{t('tittle')}</label>
                        <Field
                            className="w-full my-2 rounded-sm bg-gray-100 h-8 border-b-[2px] hover:bg-gray-200 border-solid border-gray-700 focus:outline-none focus:border-blue-500 transition-colors duration-500 ease-out"
                            name="tittle"
                            type="text"
                        />
                        <ErrorMessage name='tittle' />
                    </div>
                    <div className='flex-grow my-5 flex flex-col'>
                        <label className='block text-sm text-gray-500'>{t('content')}</label>
                        <Field
                            as="textarea"
                            className="w-full my-2 rounded-sm bg-gray-100 border-b-[2px] hover:bg-gray-200 border-solid border-gray-700 focus:outline-none focus:border-blue-500 transition-colors duration-500 ease-out resize-none flex-grow"
                            name="content"
                        />
                        <ErrorMessage name='content' />
                    </div>
                    <div className='mt-auto border-t pt-3 flex justify-end'>
                        <button className='bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl'>
                            {t("save")}
                        </button>
                    </div>
                </Form>
            </Formik>
        </div>
        , tittle: <h4 className='font-bold text-lg'>{t('createNewRec')}</h4>
            , isOpen: true
        })
    }

    if (!isReady) {
        return null;
    }

    return (
        <>
            <div className={`${panelCollapsed ? 'w-1/12 max-md:w-full' : 'w-1/4 max-md:w-full'} transition-all duration-500 h-full flex flex-col gap-5`}>
                <div className={`relative bg-white flex flex-col rounded-2xl border shadow-sm overflow-hidden transition-all duration-500 flex-1`}>
                    <button
                        className={`absolute top-2 right-2 p-1 bg-[#ececec] rounded-full max-md:hidden`}
                        onClick={() => setPanelCollapsed(!panelCollapsed)}
                    >
                        <ArrowDownLeftIcon className={`transition-all duration-500 ${panelCollapsed ? "rotate-180" : ""} size-5`} />
                    </button>
                    <div className='flex flex-col h-full'>
                        <div className='py-8 px-5 bg-white border-b shadow-sm'>
                            <h4 className='font-bold text-xl'>{t("recommendation")}</h4>
                        </div>
                        <div className='overflow-y-auto h-full flex flex-col gap-2 flex-1 px-5 py-5 bg-[#f7f7f7] min-w-80'>
                            {recommendations.map((a) => (
                                <button key={a.tittle} onClick={() => RecRightBar(a)} className='w-full bg-[#f6f6f6] min-h-8 h-8 flex items-center rounded-xl overflow-hidden gap-5 shadow'>
                                    <div className='h-full w-10 min-w-10 bg-blue-500'></div>
                                    <h4 className='text-ellipsis text-nowrap overflow-hidden'>{a.tittle}</h4>
                                </button>
                            ))}
                        </div>
                        <div className={`flex flex-col px-5 py-3 gap-5 justify-between ${panelCollapsed ? "hidden" : ""}`}>
                            <div className='gap-3 flex flex-col text-center font-semibold underline text-blue-400'>
                                <p className='text-ellipsis text-nowrap overflow-hidden'>{t("addRecText")}</p>
                                <hr />
                            </div>
                            <div className='text-center gap-1 flex flex-col'>
                                <p className='text-sm font-semibold text-[#818ea4] text-ellipsis text-nowrap overflow-hidden'>
                                    {t("addRecButtonText")}
                                </p>
                                <button onClick={() => createNewRec()} className='bg-blue-200 w-full py-2 rounded-xl text-[#818ea4] flex text-lg font-semibold gap-5 px-5 items-center justify-start text-ellipsis text-nowrap overflow-hidden'>
                                    <div className='p-1 bg-blue-100 rounded-full'>
                                        <PlusIcon className='size-6 text-[#6b97f2]' />
                                    </div>
                                    {t("addRec")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`bg-[#ececec] ${panelCollapsed ? "block" : "hidden"}`}>
                    <button onClick={() => createNewRec()} className='bg-blue-200 w-full py-2 rounded-xl text-[#818ea4] flex text-lg font-semibold gap-5 px-5 items-center justify-start'>
                        <div className='p-1 bg-blue-100 rounded-full'>
                            <PlusIcon className='size-6 text-[#6b97f2]' />
                        </div>
                        {t("add")}
                    </button>
                </div>
            </div>
        </>
    );
}
