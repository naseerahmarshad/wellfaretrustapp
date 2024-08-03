'use client'

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';
import useSWR from 'swr';
import NonSSRWrapper from './components/NonSSRWrapper';
import Sidebar from './components/Sidebar';
import sanitizeHtml from 'sanitize-html';
import BACKEND_URL from '@/app/config/backendurls';
import FetcherSWR from './components/FetcherSWR';
import LoaderComponent from './components/Loadercomponent';

export default function AdminHome() {

    const { data, error } = useSWR(`${BACKEND_URL}/notes/?status=published`, FetcherSWR);

    if (error) return 'Failed to load';
    if (!data) return (<LoaderComponent />);

    return (
        <>
            <NonSSRWrapper>
                <div className='fullpage-wrapper'>
                    <Sidebar />
                    <div className='restpage-wrapper'>
                        <div className='block w-full'>
                            <h1 className='text-[40px] font-bold mb-5'>
                                <small className='text-[#999] flex text-[60%] font-normal mb-[-10px]'>Welcome</small>
                                Admin!
                            </h1>
                            <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                                <div className='flex items-center border-[1px] border-[#ddd] bg-[#fff] py-[20px] px-[40px] rounded-[10px]'>
                                    <img src='/images/icon2.svg' alt='icons' className='opacity-[0.3] w-[150px]' />
                                    <div className='flex flex-col w-full'>
                                        <h2 className='flex justify-end text-[50px] text-primary leading-[1] mb-[0px] font-bold'>{data.length}</h2>
                                        <h2 className='flex justify-end text-[24px] font-semibold'>Total Notes</h2>
                                        <div className='flex justify-end mt-3'>
                                            <Link className='inline-flex py-3 px-6 border-[1px] border-[#ddd] rounded-[10px] font-semibold hover:bg-[#f3f3f3]' href='/administrator/view-all-notes'>View All</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center border-[1px] border-[#ddd] bg-[#fff] py-[20px] px-[40px] rounded-[10px]'>
                                    <img src='/images/icon1.svg' alt='icons' className='opacity-[0.3] w-[150px]' />
                                    <div className='flex flex-col w-full'>
                                        <h2 className='flex justify-end text-[24px] font-semibold'>Create New Note</h2>
                                        <div className='flex justify-end mt-3'>
                                            <Link className='inline-flex py-3 px-6 border-[1px] border-[#ddd] rounded-[10px] font-semibold hover:bg-[#f3f3f3]' href='/administrator/add-new-note'>Add Now</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </NonSSRWrapper>
        </>
    );
}
