'use client'
import React, { useState } from "react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import NonSSRWrapper from "../components/NonSSRWrapper";
import LoaderComponent from "../components/Loadercomponent";
import Sidebar from "../components/Sidebar";
import BACKEND_URL from "@/app/config/backendurls";
import FetcherSWR from "../components/FetcherSWR";
import sanitizeHtml from 'sanitize-html';
import { Editor } from 'primereact/editor';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

export default function AddNewNote() {

    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');
    const [status, setStatus] = useState('Published');
    const [error, setError] = useState('');
    const notify = () => toast("Added Successfully!");
    const notifyError = () => toast.error("Please fill out all fields");

    const handleSubmit = async (e) => {
        e.preventDefault();

        let accessToken = Cookies.get('token');

        // Form validation
        if (!title.trim() || !contents.trim()) {
            // setError('Please fill out all fields');
            notifyError();
            return;
        }

        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json",
            'Authorization': `Bearer ${accessToken}`
        }

        let postdata = {
            title,
            contents,
            status
        }

        let bodyContent = JSON.stringify(postdata);

        try {
            let response = await fetch(`${BACKEND_URL}/notes/`, {
                method: "POST",
                body: bodyContent,
                headers: headersList
            });

            if (!response.ok) {
                throw new Error('Failed to add note');
            }

            let data = await response.json();
            console.log(data);

            // Clear form fields after successful submission
            setTitle('');
            setContents('');
            setStatus('');
            setError('');
            notify();
        } catch (error) {
            setError('Failed to add note');
            console.error(error);
        }
    }

    return (
        <>
            <NonSSRWrapper>
                <div className='fullpage-wrapper'>
                    <Sidebar />
                    <div className='restpage-wrapper'>
                        <div className='block w-full'>
                            <h1 className='text-[30px] font-bold mb-4'>
                                Add New Note
                            </h1>
                            <div className='w-full flex items-center border-[1px] border-[#ddd] bg-[#fff] py-[30px] px-[30px] rounded-[10px]'>
                                <div className="w-full">
                                    {/* {error && <p className="text-red-500">{error}</p>} */}
                                    <form onSubmit={handleSubmit}>
                                        <label className="flex mb-2 font-medium">
                                            Title
                                        </label>
                                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="flex w-full mb-5 px-3 py-3 bg-white border-solid border-[1px] border-[#ddd] outline-none font-medium text-gray-dark rounded-[10px]" />
                                        <Editor value={contents} onTextChange={(e) => setContents(e.htmlValue)} style={{ width: '100%', height: '320px' }} />
                                        <div className="flex mt-5">
                                            <div>
                                                <select className="inlne-flex w-full mb-2 px-3 py-2 bg-white border-solid border-[1px] border-[#ddd] outline-none font-medium text-gray-dark rounded-[10px]" value={status} onChange={(e) => setStatus(e.target.value)}>
                                                    <option value="Published">Published</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button type="submit" className="inline-flex px-5 py-3 mt-3 bg-primary rounded-[10px] text-white hover:bg-secondary">Submit</button>
                                        <ToastContainer />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </NonSSRWrapper>
        </>
    )
}