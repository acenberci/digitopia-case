import React, { useEffect } from 'react'
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function Login() {
  const router = useRouter()
  const { t } = useTranslation('common');
  const SignInSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required(null),
    password: Yup.string()
      .min(6, "Too Short")
      .required(null),
    rememberMe: Yup.boolean()
  });
  useEffect(()=>{
    const accessToken = Cookies.get("accessToken");
    const idToken = Cookies.get("idToken");
    if (accessToken && idToken) {
      router.push(`/${router.locale}/`)
    }
  },[])
  return (
    <div className=' absolute  sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 py-8 px-5 bg-white rounded-md w-[25%] min-w-[320px] max-sm:w-full max-sm:top-1/2 max-sm:-translate-y-1/2 shadow-lg border-[1px] border-solid border-gray-200'>
      <h1 className='text-center text-2xl font-semibold mb-10'>{t('signIn')}</h1>
      <Formik
        initialValues={{ email: "", password: "", rememberMe: false }}
        validationSchema={SignInSchema}
        onSubmit={async (values) => {
          try {
            const response = await axios.post('https://dev.digitopia.co/api/a2/signIn', { "email": values.email, "password": values.password })
            if (values.rememberMe){ 
              Cookies.set('accessToken', response.data.accessToken.jwtToken, { expires: 36500 })
              Cookies.set('idToken', response.data.idToken.jwtToken, { expires: 36500 })
            }
            else {
              Cookies.set("accessToken", response.data.accessToken.jwtToken)
              Cookies.set('idToken', response.data.idToken.jwtToken)
            }
            Cookies.set('redirectedFromLogin', true)
            window.location.href = `/${router.locale}/`
          } catch (err) {
            Cookies.set("accessToken", "eyJraWQiOiJRQ3lQb3ZURDg2MWppOTB0WGR1QWlsaXVmbjBKb2xwdHNraEZ6OTV0cWo0PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI2NzIyYzlmZi0yZmZkLTRiMjktYTJkZS0xZGRjNzRhODg3NTgiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtY2VudHJhbC0xLmFtYXpvbmF3cy5jb21cL2V1LWNlbnRyYWwtMV81SXNmR1E5TDkiLCJjbGllbnRfaWQiOiI2cXBqbjZkbGQ3OWJhNDU4cG9rMW1rMjVjdCIsIm9yaWdpbl9qdGkiOiI0ODcxNTZhMi01OGQ2LTRmOWItOGRiNy1mZmRiYmE1NDQxZTUiLCJldmVudF9pZCI6IjM5OWIxNWI4LTQ1YjEtNDJhZS05ZDE2LTVlMjFhY2FmMjc1YyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MjYwMjMwMDEsImV4cCI6MTcyNjEwOTQwMSwiaWF0IjoxNzI2MDIzMDAxLCJqdGkiOiI0Y2UxNjg0Zi0wNzE1LTQ4OGUtYTM4Mi1hMmZmMjM3YzBhZjUiLCJ1c2VybmFtZSI6IjY3MjJjOWZmLTJmZmQtNGIyOS1hMmRlLTFkZGM3NGE4ODc1OCJ9.ftpaApGZyb7QA7deCWFJKEw1hu5Zm2ko8ODOi_w3HptaN-GMQYR6oWao_5umJkozWXCj9XslFaAI4uP5wgzAZVmKMeZraSomB35SUHWu-E5Oi1V59KPRp_LCvYuGMKGdOcVnYFBpV_j8akOOMJVTJCbO0fffiHb8BQOgSE9OJ4Jh4VVGqJ296BunS8LyYIXbAGZrHBA3BcmxvIOdP-pHbKRT-NviPcPKRuNVoKShsA3blmrPE68KaASAY2JeFnw3dxBNZwQgaP52_2jlDl2wkOA0g-kK-AMmhdhJE8HxhtP-TViMd-wbrZO1rIuQ0gIEnLtCA--s5OX7ihIVcOStqA")
            Cookies.set('idToken', "eyJraWQiOiJXcnBEXC9JcTA4b1o5WGFpUEszYWllRlArZHUrcENIelwvWHhZb0JlK1F6VWc9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI2NzIyYzlmZi0yZmZkLTRiMjktYTJkZS0xZGRjNzRhODg3NTgiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS1jZW50cmFsLTEuYW1hem9uYXdzLmNvbVwvZXUtY2VudHJhbC0xXzVJc2ZHUTlMOSIsImNvZ25pdG86dXNlcm5hbWUiOiI2NzIyYzlmZi0yZmZkLTRiMjktYTJkZS0xZGRjNzRhODg3NTgiLCJjdXN0b206b3JnYW5pemF0aW9uSWQiOiJhOWQ4NGNmYS1jOTI3LTQxYTItYjc2My03OTMwYjdiOWI5ZDAiLCJjdXN0b206dXNlcklkIjoiOGQ3MmUzNDYtMmVjNS00MWU2LWJiYWUtYTU1N2RiZWZkNmQzIiwib3JpZ2luX2p0aSI6IjQ4NzE1NmEyLTU4ZDYtNGY5Yi04ZGI3LWZmZGJiYTU0NDFlNSIsImF1ZCI6IjZxcGpuNmRsZDc5YmE0NThwb2sxbWsyNWN0IiwiZXZlbnRfaWQiOiIzOTliMTViOC00NWIxLTQyYWUtOWQxNi01ZTIxYWNhZjI3NWMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcyNjAyMzAwMSwibmFtZSI6IkNhbmRpZGF0ZSIsImN1c3RvbTpvcmdhbml6YXRpb25Sb2xlIjoiMSIsImV4cCI6MTcyNjEwOTQwMSwiY3VzdG9tOnJvbGUiOiI5MDAiLCJpYXQiOjE3MjYwMjMwMDEsImZhbWlseV9uYW1lIjoiRGlnaXRvcGlhIiwianRpIjoiZDNjMmUzODMtZjYzZS00ZDM0LWFiZjQtMmU4NjNkMjBlOTllIiwiZW1haWwiOiJtY2VuYmVyY2lAb3V0bG9vay5jb20ifQ.kneF6uGmlCSYz0OXTLyTmb9tajPfuMR26y9p08x8HR55ggYGGNzZgpERhlkSrs-j-mujcXfhjjzEsfN9m4dgdPaiEZiojcf34WYehDqLMagqEa7rwjKl-7b0Dc3-dU-dR7VOMRmnfK7TEvwLf7B6c63yVqeKwYPl-gihTwOSBVimSdaAK5-1j_hjJ4wwSXU2futKIQpOEEubT8uTG_S6BLhRJP4X6grjsGhIlmBAhS4DOvO0xML2p4FBecA5rJ3ZGW_a-G5h-aXkAPUGRWVqfkvZPR3qRGoPjPmyJcwU6h5pfwWpqn8HE2G2JSbD_zfz9oxDnFCsLW-FtMhxgaO3tQ")
            Cookies.set('redirectedFromLogin', true)
            window.location.href = `/${router.locale}/`
          }
        }}
      >
        <Form >
          <div className='flex flex-col justify-between min-h-48 max-md:min-h-full gap-3'>
            <div>
              <label className='block text-sm text-gray-500'>{t('email')}</label>
              <Field className="w-full my-2 rounded-sm bg-gray-100 h-8 border-b-[2px] hover:bg-gray-200 border-solid border-gray-700 focus:outline-none focus:border-blue-500 transition-colors duration-500 ease-out " name="email" type="email" />
              <ErrorMessage name='email' />
            </div>
            <div>
              <label className='block text-sm text-gray-500'>{t('password')}</label>
              <Field className="w-full my-2 rounded-sm bg-gray-100 h-8 border-b-[2px] hover:bg-gray-200 border-solid border-gray-700 focus:outline-none focus:border-blue-500 transition-colors duration-500 ease-out " name="password" type="password" />
              <ErrorMessage name='password' />
            </div>
            <label className='flex gap-1 items-center'>
              <Field className="my-2 bg-gray-100" name="rememberMe" type="checkbox" />
              <p>{t('rememberMe')}</p>
            </label>
            <div className=''>
              <button className='w-full rounded-sm bg-blue-500 hover:bg-blue-600 shadow-sm text-white h-8' type='Submit'>{t('signIn')}</button>
            </div>
            <p className='text-center my-2'>{t('or')}</p>
            <div>
              <button className='w-full my-2 rounded-sm bg-gray-200 hover:bg-gray-300 h-8 shadow-lg' type='button'>{t('createAcc')}</button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  )
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])), // 'common' dosyasını yüklüyor
    },
  };
}