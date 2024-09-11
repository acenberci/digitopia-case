import Popup from '@/components/popup';
import RightBar from '@/components/rightbar';
import TopBar from '@/components/topbar';
import { ChartBarIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import { useContext, useEffect } from 'react';
import { HelperContext } from "@/helpers/HelperContext";
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Cookies from 'js-cookie';
import DateRangePicker from '@/components/DateRangePicker';

export default function Home() {
  const { popups, setPopups, rightBar, userDetails } = useContext(HelperContext);
  const router = useRouter();
  const { t } = useTranslation('common');
  const changeLanguage = () => {
    router.locale == "en" ? router.push(router.pathname, router.asPath, { locale: "tr" }) : router.push(router.pathname, router.asPath, { locale: "en" })
  }

  useEffect(() => {
    const redirectedFromLogin = Cookies.get('redirectedFromLogin');
    if (redirectedFromLogin) {
      Cookies.remove('redirectedFromLogin');
      setPopups(prev => [
        ...prev,
        {
          show: true,
          children: (
            <div className='flex justify-between px-[25px] pt-1'>
              <h4 className="bg-gradient-to-r from-[#f3b3f0] to-[#758ef0] greetingsText inline text-2xl font-bold">{t('hello')} {userDetails.name}</h4>
              <button onClick={() => router.push(`/${router.locale}/charts`)} className="bg-gradient-to-r from-[#f3b3f0] to-[#758ef0] hover:brightness-110 border rounded-md py-1 px-2 text-white shadow-sm flex text-center items-center gap-1 text-[1.25rem]">Charts<ChartBarIcon className='size-5' /></button>
            </div>
          ),
        },
      ]);
    }
    const accessToken = Cookies.get("accessToken");
    const idToken = Cookies.get("idToken");
    if (!(accessToken && idToken)) {
      Cookies.remove("accessToken")
      Cookies.remove("idToken")
      router.push(`/${router.locale}/login`)
    }
  }, []);

  return (
    <>
      <TopBar />
      <RightBar />
      <main className='mt-[65px] h-[calc(100vh-65px)] bg-[#f4f4f4]'>
        <div className='flex justify-between px-[25px] pt-1'>
          <h4 className="bg-gradient-to-r from-[#f3b3f0] to-[#758ef0] greetingsText inline text-2xl font-bold">{t('hello')} {userDetails.name}</h4>
          <button onClick={() => router.push(`/${router.locale}/charts`)} className="bg-gradient-to-r from-[#f3b3f0] to-[#758ef0] hover:brightness-110 border rounded-md py-1 px-2 text-white shadow-sm flex text-center items-center gap-1 text-[1.25rem]">Charts<ChartBarIcon className='size-5' /></button>
        </div>
        <div className='px-[25px] pt-1'>
          <button onClick={() => changeLanguage()} className=' text-gray-500 hover:text-gray-800 relative'><img src={`/images/icons/locales/${router.locale}flag.png`} alt="" className=' h-5 absolute top-0 right-0' /> <GlobeAltIcon className='size-14'></GlobeAltIcon></button>
        </div>
      </main>
    </>
  );
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}