'use client'
import React from "react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import NonSSRWrapper from "../components/NonSSRWrapper";
import LoaderComponent from "../components/Loadercomponent";
import Sidebar from "../components/Sidebar";
import BACKEND_URL from "@/app/config/backendurls";
import FetcherSWR from "../components/FetcherSWR";
import sanitizeHtml from 'sanitize-html';

export default function AddNewNote() {

    const { data, error } = useSWR(`${BACKEND_URL}/notes/`, FetcherSWR);

    if (error) return 'Failed to load';
    if (!data) return (<LoaderComponent />);

    // Sanitize HTML content function
    const sanitizeHtmlContent = (htmlContent) => {
        htmlContent = htmlContent.replace(/'/g, '&#39;');
        // htmlContent = htmlContent.replace(/\\/g, "'");
        htmlContent = htmlContent.replace(/\\\\/g, "'");
        return sanitizeHtml(htmlContent, {
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'h2'], // Specify the allowed HTML tags
            allowedAttributes: {
                a: ['href'] // Specify the allowed attributes for <a> tags
            },
            allowedIframeHostnames: [] // Prevent iframes
        });
    };

    return (
        <>
            <NonSSRWrapper>
                <div className='fullpage-wrapper'>
                    <Sidebar />
                    <div className='restpage-wrapper'>
                        <div className='block w-full'>
                            <h1 className='text-[30px] font-bold mb-4'>
                                Settings
                            </h1>
                            <div className='w-full flex items-center border-[1px] border-[#ddd] bg-[#fff] py-[20px] px-[40px] rounded-[10px]'>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </NonSSRWrapper>
        </>
    )
}