import React, { useContext, useEffect, useState } from 'react'
import { ChartBarIcon, HomeIcon } from '@heroicons/react/24/solid'
import { HelperContext } from '@/helpers/HelperContext';
import { useRouter } from 'next/router';
export default function TopBar() {
    const [path, setPath] = useState("")
    const router = useRouter();
    const { userDetails } = useContext(HelperContext);

    useEffect(() => {
        setPath(router.asPath)
    }, [])
    return (
        <header className=' z-10 fixed w-full top-0 left-0 py-[5px] px-[25px] box-border border-b-[1px] border-solid border-b-[rgb(230,230,230)] flex justify-between bg-white items-center'>
            <a href='#'><img src="/images/logos/digitopiaLogoWithName.png" alt="" className='h-full max-sm:hidden' />
                <img src="/images/logos/digitopiaLogo.png" alt="" className='h-full sm:hidden' /></a>
            <div className='flex h-[54px] items-center absolute -translate-x-1/2 left-1/2'>
                <button onClick={() => router.push(`/${router.locale}/`)} className={`p-[15px] hover:scale-[110%] hover:brightness-105 ${path === "/" && " text-blue-500"}`}>
                    <HomeIcon className='size-[24px]'></HomeIcon>
                </button>
                <div className=' h-full py-[12px] px-[6px]'>
                    <div className='border-l-[2px] border-solid border-[rgb(153,153,153)] h-full'></div>
                </div>
                <button onClick={() => router.push(`/${router.locale}/charts`)} className={`p-[15px] hover:scale-[110%] hover:brightness-105 ${path === "/charts" && " text-blue-500"}`}>
                    <ChartBarIcon className='size-[24px]'></ChartBarIcon>
                </button>
            </div>
            <div className='flex h-[54px] items-center'>
                <div className='px-[10px] flex items-center'>
                    <div className='flex size-[34px] rounded-full bg-blue-500 text-white font-[600] text-[14px] justify-center items-center max-sm:mr-4'>{userDetails.name && userDetails.name.charAt(0)}</div>
                    <div className='flex flex-col px-[10px] max-sm:hidden'>
                        <h4 className='font-[600] text-[14px] text-[rgb(41,41,41)]'>{userDetails.name}</h4>
                        <h4 className='font-[500] text-[12px] text-[rgba(41,41,41,0.5)]'>{userDetails.family_name}</h4>
                    </div>
                </div>
            </div>
        </header>
    )
}
