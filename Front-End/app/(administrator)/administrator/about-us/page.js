'use client'
import React from "react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import Aboutus from "../components/Aboutus";
import NonSSRWrapper from "../components/NonSSRWrapper";
import LoaderComponent from "../components/Loadercomponent";
import ClientOnlyComponent from "../components/ClientOnlyComponent";
import Sidebar from "../components/Sidebar";

// const ClientOnlyComponent = dynamic(() => import('../components/ClientOnlyComponent'), { 
//     ssr: false,
//     loading: () => {
//         return (
//             <>
//                 <LoaderComponent />
//             </>
//         )
//     }
// });

export default function AboutUs() {
    return (
        <>
            <NonSSRWrapper>
                <div className='fullpage-wrapper'>
                    <Sidebar />
                    <div className='restpage-wrapper'>
                        <div>
                            <Aboutus />
                            <ClientOnlyComponent />
                            <Link href='/administrator/' className="inline-flex border border-primary p-[10px] font-bold m-3">Back to Admin</Link>
                        </div>
                    </div>
                </div>
            </NonSSRWrapper>
        </>
    )
}