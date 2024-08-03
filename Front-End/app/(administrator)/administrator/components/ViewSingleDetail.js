'use client'
import React, { useState, useEffect } from "react"
import useSWR, { mutate } from 'swr';
import LoaderComponent from "../components/Loadercomponent";
import BACKEND_URL from "@/app/config/backendurls";
import FetcherSWR from "./FetcherSWR";
import he from 'he';
import { Editor } from 'primereact/editor';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

export default function ViewSingleDetail(props) {
    const dataid = props.noteid;

    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');
    const [status, setStatus] = useState('Published');
    const [formerror, setError] = useState('');
    const notify = () => toast("Updated Successfully!");
    const notifyError = () => toast.error("Please fill out all fields");

    // Data fetcher
    const { data, error } = useSWR(`${BACKEND_URL}/notes/${dataid}`, FetcherSWR);

    useEffect(() => {
        if (data) {
            setTitle(preprocessAndDecodeHTML(data.title));
            setContents(preprocessAndDecodeHTML(data.contents));
        }
    }, [data]);

    if (error) return 'Failed to load';
    if (!data) return (<LoaderComponent />);

    const preprocessHTML = (htmlContent) => {
        // Replace double backslashes with single backslashes
        // return htmlContent.replace(/\\\\/g, '\\');
        // return htmlContent.replace(/\\\\/g, "'"); &quot;
        return htmlContent.replace(/\\\\/g, '\\').replace(/\\/g, "'").replace(/'/g, '&#39;').replace(/"/g, '').replace(/&quot;/g, '');
    };

    // Function to preprocess and decode HTML content
    const preprocessAndDecodeHTML = (htmlContent) => {
        const processedHTML = preprocessHTML(htmlContent);
        return he.decode(processedHTML);
    };

    // handleUpdate
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            let accessToken = Cookies.get('token');

            // Form validation
            if (!title?.trim() || !contents?.trim()) {
                // setError('Please fill out all fields');
                notifyError();
                return;
            }
            let headersList = {
                "Accept": "*/*",
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`
            };

            let putData = {
                title,
                contents,
                status
            };

            let bodyContent = JSON.stringify(putData);
            await fetch(`${BACKEND_URL}/notes/${dataid}`, {
                method: 'PUT',
                body: bodyContent,
                headers: headersList
            });

            // After updating, refetch the data to reflect changes
            mutate(`${BACKEND_URL}/notes/`);
            // console.log('Updated Successfully! ', data);
            setError('');
            // setTitle('');
            // setContents('');
            notify();
        } catch (error) {
            console.error('Failed to update item:', error);
        }
    }

    return (
        <>
            <div className="block w-full px-6 pb-10">
                {/* <h2 className="text-[30px] font-bold text-[#000]" dangerouslySetInnerHTML={{ __html: he.decode(preprocessHTML(data.title)) }}></h2>
                <div dangerouslySetInnerHTML={{ __html: he.decode(preprocessHTML(data.contents)) }}></div> */}

                {formerror && <p className="text-[red] mb-5 inline-flex px-4 py-2 border-solid border-[1px] border-red rounded-lg">{formerror}</p>}

                <form onSubmit={handleUpdate}>
                    <label className="flex mb-2 font-medium">
                        Edit Title
                    </label>
                    <div className="titleeditor mb-5">
                        <Editor value={preprocessAndDecodeHTML(data.title)} onTextChange={(e) => setTitle(e.htmlValue)} style={{ width: '100%', height: '50px' }} />
                    </div>
                    <div className="contenteditormain">
                        <Editor value={preprocessAndDecodeHTML(data.contents)} onTextChange={(e) => setContents(e.htmlValue)} style={{ width: '100%', height: '320px' }} />
                        {/* Title: {title}, Content: {contents} */}
                    </div>
                    <div className="flex mt-3 mb-0 border-b border-solid border-gray-light2 pb-2">
                        <label>Current Status: <strong>{data.status}</strong></label>
                    </div>
                    <div className="flex mt-3">
                        <div className="flex items-center">
                            <label className="w-[200px]">Set status to: </label>
                            <select className="inlne-flex w-full mb-0 px-3 py-2 bg-white border-solid border-[1px] border-[#ddd] outline-none font-medium text-gray-dark rounded-[10px]" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="Published">Published</option>
                                <option value="Trash">Trash</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="inline-flex px-5 py-3 mt-3 bg-primary rounded-[10px] text-white hover:bg-secondary">Update</button>
                </form>
            </div>
        </>
    )
}