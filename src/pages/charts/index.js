import GanttChart from '@/components/ganttchart.js';
import Popup from '@/components/popup';
import RecPanel from '@/components/recPanel';
import RightBar from '@/components/rightbar';
import TopBar from '@/components/topbar';
import { HelperContext } from '@/helpers/HelperContext';
import React, { useContext, useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Chart() {
  const { popups, setTasks, tasks, dateRange } = useContext(HelperContext);
  const router = useRouter();

  useEffect(() => {
    setTasks([
      { task: 'Task 1', startDate: '2023-08-29', endDate: '2024-09-05' },
      { task: 'Task 2', startDate: '2023-12-03', endDate: '2024-03-08' },
    ]);

    const accessToken = Cookies.get("accessToken");
    const idToken = Cookies.get("idToken");
    if (!(accessToken && idToken)) {
      Cookies.remove("accessToken");
      Cookies.remove("idToken");
      router.push(`/${router.locale}/login`);
    }
  }, [router.locale, router.push, setTasks]);

  return (
    <>
      <TopBar />
      <RightBar dateRange={dateRange} />
      <main className='mt-[65px] sm:h-[calc(100vh-65px)] flex items-center justify-center bg-[#f4f4f4]'>
        <div className='flex w-full px-[25px] gap-[25px] h-3/4 max-md:grid max-md:grid-cols-1 max-md:py-5'>
          <RecPanel />
          <div className='w-full flex justify-center'>
            {tasks && <GanttChart tasks={tasks} />}
          </div>
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
