import React, { useContext, useEffect, useState } from 'react'
import { ChevronLeftIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/solid'
import { HelperContext } from '@/helpers/HelperContext';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function RightBar() {
    const { rightBar, setRightBar, userDetails } = useContext(HelperContext);
    const { t } = useTranslation('common');
    const router = useRouter()
    function logout(){
        Cookies.remove("accessToken");
        Cookies.remove("idToken");
        router.push(`/${router.locale}/login`);
    }
    function toggleRightBar() {
        if (rightBar.isOpen) setRightBar(prev => ({ ...prev, isOpen: false }))
        else setRightBar({
            content:
                <div className='flex flex-col gap-2'>
                    <div>
                        <div className="text-gray-500 font-semibold w-fit">
                            <h4>{t("name")}</h4>
                            <hr className='border-1' />
                        </div>
                        <div className="text-gray-900">{userDetails.name}</div>
                    </div>
                    <div>
                        <div className="text-gray-500 font-semibold w-fit">
                            <h4>{t("familyName")}</h4>
                            <hr className='border-1' />
                        </div>
                        <div className="text-gray-900">{userDetails.family_name}</div>
                    </div>
                    <div>
                        <div className="text-gray-500 font-semibold w-fit">
                            <h4>{t("email")}</h4>
                            <hr className='border-1' />
                        </div>
                        <div className="text-gray-900">{userDetails.email}</div>
                    </div>
                    <div>
                        <div className="text-gray-500 font-semibold w-fit">
                            <h4>{t("username")}</h4>
                            <hr className='border-1' />
                        </div>
                        <div className="text-gray-900">{userDetails.username}</div>
                    </div>
                    <div>
                        <div className="text-gray-500 font-semibold w-fit">
                            <h4>{t("clientId")}</h4>
                            <hr className='border-1' />
                        </div>
                        <div className="text-gray-900">{userDetails.client_id}</div>
                    </div>

                    <div>
                        <div className="text-gray-500 font-semibold w-fit">
                            <h4>{t("organizationId")}</h4>
                            <hr className='border-1' />
                        </div>
                        <div className="text-gray-900">{userDetails.organizationId}</div>
                    </div>
                    <div>
                        <div className="text-gray-500 font-semibold w-fit">
                            <h4>{t("organizationRole")}</h4>
                            <hr className='border-1' />
                        </div>
                        <div className="text-gray-900">{userDetails.organizationRole}</div>
                    </div>
                    <div>
                        <div className="text-gray-500 font-semibold w-fit">
                            <h4>{t("role")}</h4>
                            <hr className='border-1' />
                        </div>
                        <div className="text-gray-900">{userDetails.role}</div>
                    </div>
                </div>
                
            , tittle: <><h4 className='font-bold text-lg'>{t('userDetails')}</h4><button onClick={logout}> <ArrowLeftEndOnRectangleIcon className='size-7'></ArrowLeftEndOnRectangleIcon></button></>
            , isOpen: true
        })
    }
    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity duration-500 backdrop-blur-sm ${rightBar.isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => toggleRightBar()}
            ></div>
            <div
                className={`md:min-w-[400px] md:max-w-[400px] max-md:w-full max-h-[100vh] h-[100vh] flex-col bg-white ease-in-out transition-transform duration-1000 z-50 fixed right-0 top-0 ${rightBar.isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className='py-[12px] pl-[40px] px-[10px] h-[65px] relative box-border border-b-[1px] border-solid border-b-transparent flex items-center justify-between'>
                    <button id='navbarToggleButton' onClick={toggleRightBar} className={` transition-all ease-in-out duration-1000  -translate-y-1/2 absolute top-1/2 left-0 p-[6px] justify-center flex ${rightBar.isOpen ? "ml-2 translate-x-0 hover:translate-x-1" : "-translate-x-[40px] hover:-translate-x-[44px]"}`}>
                        <ChevronLeftIcon className={`h-full transition-all ease-in-out duration-1000 size-[20px] ${rightBar.isOpen && "rotate-180"}`}></ChevronLeftIcon>
                    </button>
                    {rightBar.tittle}
                </div>
                <div className='elementContainer px-[10px] py-[20px] h-[calc(100vh-65px)] overflow-auto flex flex-col border-t-[1px] border-solid border-t-transparentBorder gap-[5px] relative'>
                    {rightBar.content}
                </div>
            </div>
        </>
    )
}
