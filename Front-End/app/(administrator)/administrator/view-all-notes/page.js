'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import useSWR, { mutate } from 'swr';
import NonSSRWrapper from "../components/NonSSRWrapper";
import LoaderComponent from "../components/Loadercomponent";
import Sidebar from "../components/Sidebar";
import BACKEND_URL from "@/app/config/backendurls";
import FetcherSWR from "../components/FetcherSWR";
import sanitizeHtml from 'sanitize-html';
import he from 'he';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ViewSingleDetail from "../components/ViewSingleDetail";
import Cookies from 'js-cookie';

export default function ViewAllNotes() {

    // Search state
    const [globalFilter, setGlobalFilter] = useState([]);

    const [rowDataToDelete, setRowDataToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const notifyDelete = () => toast("Item Deleted Successfully!");

    // view note details in sidesheet
    const [viewnoteDetails, setViewnoteDetails] = useState();
    const [viewnoteDetailsModal, setViewnoteDetailsModal] = useState(true);

    // Data fetcher
    const { data, error } = useSWR(`${BACKEND_URL}/notes/?status=published`, FetcherSWR, {
        refreshInterval: 1000, // Example: revalidate every 1 seconds
    });

    if (error) return 'Failed to load';
    if (!data) return (<LoaderComponent />);

    // Sanitize HTML content function
    // const sanitizeHtmlContent = (htmlContent) => {
    //     htmlContent = htmlContent.replace(/'/g, '&#39;');
    //     // htmlContent = htmlContent.replace(/\\/g, "'");
    //     htmlContent = htmlContent.replace(/\\\\/g, "'");
    //     return sanitizeHtml(htmlContent, {
    //         allowedTags: ['b', 'i', 'em', 'strong', 'a', 'h2'], // Specify the allowed HTML tags
    //         allowedAttributes: {
    //             a: ['href'] // Specify the allowed attributes for <a> tags
    //         },
    //         allowedIframeHostnames: [] // Prevent iframes
    //     });
    // };

    // // Render function for DataTable
    // const renderHtmlContent = (rowData, field) => {
    //     const sanitizedHtml = sanitizeHtmlContent(rowData[field]);
    //     return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
    // };

    const preprocessHTML = (htmlContent) => {
        // Replace double backslashes with single backslashes
        // return htmlContent.replace(/\\\\/g, '\\');
        // return htmlContent.replace(/\\\\/g, "'"); &quot;
        return htmlContent.replace(/\\\\/g, '\\').replace(/\\/g, "'").replace(/'/g, '&#39;').replace(/"/g, '').replace(/&quot;/g, '');
    };

    // DateFormat
    const DateFormat = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleDeleteConfirm = async () => {
        console.log('Deleting item with ID:', rowDataToDelete.id);
        // Call your delete function or API here
        try {

            let accessToken = Cookies.get('token');
            // Make API call to delete the item from the backend
            await fetch(`${BACKEND_URL}/notes/${rowDataToDelete.id}`, { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            // Trigger a re-fetch of the data from the server and update the local cache
            mutate(`${BACKEND_URL}/notes/`);
        } catch (error) {
            console.error('Failed to delete item:', error);
        }

        // Reset the state after deletion
        setRowDataToDelete(null);
        setIsDeleteModalOpen(false);

        notifyDelete();
    };

    const handleDeleteCancel = () => {
        setRowDataToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleDeleteFunction = (rowData) => {
        // Set the rowDataToDelete to trigger the confirmation modal
        setRowDataToDelete(rowData);
        setIsDeleteModalOpen(true);
    };

    // view details function
    const handleViewnoteDetails = (rowData) => {
        setViewnoteDetails(rowData.id);
        setViewnoteDetailsModal(!viewnoteDetailsModal);
        // console.log(rowData.id);
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <button onClick={() => handleViewnoteDetails(rowData)} className="inline-flex py-2 p-3 me-3 border-solid border-[1px] border-[#ccc] rounded-[10px] hover:bg-[#eee]">View</button>
                {/* <button onClick={() => handleDeleteFunction(rowData)} className="inline-flex py-2 p-3 border-solid border-[1px] border-[red] rounded-[10px] hover:bg-[#eee]">Delete</button> */}
            </>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 items-center justify-between">
            <h4 className="m-0">List of Notes</h4>
            <span className="p-input-icon-left relative z-10 bg-white">
                <img src="/images/searchicon.svg" alt="searchicon" className="w-[18px] absolute top-[18px] left-[8px] z-[-1] opacity-60" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." className="ps-10 pe-6 py-3 bg-white bg-opacity-0 border-solid border-[1px] border-[#ddd] outline-none font-medium text-gray-dark rounded-[10px]" />
            </span>
        </div>
    );
    
    // Function to trim content to 100 words
    const trimContent = (content) => {
        // If the content length is less than or equal to 100 characters, return the original content
        if (content.length <= 100) {
            return content;
        }

        // Otherwise, return the first 100 characters followed by an ellipsis
        return content.substring(0, 100) + '...';
    };

    return (
        <>
            <NonSSRWrapper>
                <div className='fullpage-wrapper'>
                    <Sidebar />
                    <div className='restpage-wrapper'>
                        <div className='block w-full'>
                            <h1 className='text-[30px] font-bold mb-4'>
                                View All Notes
                            </h1>
                            <div className='w-full flex items-center border-[1px] border-[#ddd] bg-[#fff] py-[30px] px-[30px] rounded-[10px]'>
                                <div className="card w-full">
                                    <DataTable value={data} paginator rows={10} tableStyle={{ minWidth: '50rem' }} globalFilter={globalFilter} header={header}>
                                        <Column field="id" sortable header="ID"></Column>
                                        {/* <Column field="title" sortable header="Title" body={(rowData) => renderHtmlContent(rowData, 'title')}></Column> */}
                                        <Column field="title" sortable header="Title" body={(rowData) => <div dangerouslySetInnerHTML={{ __html: he.decode(preprocessHTML(rowData.title)) }}></div>}></Column>
                                        <Column field="contents" sortable header="Contents" body={(rowData) => <div dangerouslySetInnerHTML={{ __html: he.decode(preprocessHTML(trimContent(rowData.contents))) }}></div>}></Column>
                                        <Column field="status" sortable header="Status" body={(rowData) => <div dangerouslySetInnerHTML={{ __html: he.decode(preprocessHTML(trimContent(rowData.status))) }}></div>}></Column>
                                        <Column field="created" sortable header="Created Date" body={(rowData) => DateFormat(rowData.created)}></Column>
                                        <Column field="id" sortable header="Actions" body={statusBodyTemplate} style={{ width: '200px' }}></Column>
                                    </DataTable>

                                    {/* Confirmation modal */}
                                    {isDeleteModalOpen && (
                                        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                                            <div className="bg-white p-10 rounded-[10px] shadow-[0_10px_200px_rgba(0,0,0,0.3)] border-solid border-[1px] border-[#ddd]">
                                                <p>Are you sure you want to delete?</p>
                                                <div className="flex justify-center mt-4">
                                                    <button onClick={handleDeleteConfirm} className="px-4 py-2 mr-2 bg-[red] text-white rounded-lg hover:opacity-75">Delete</button>
                                                    <button onClick={handleDeleteCancel} className="px-4 py-2 bg-[gray] text-white rounded-lg hover:opacity-75">Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <ToastContainer />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* viewdetails-page-modal */}
                <div className={viewnoteDetailsModal ? "viewdetails-page-modal" : "viewdetails-page-modal viewdetails-page-modal-active"}>
                    <div className="flex items-center p-6">
                        <button onClick={handleViewnoteDetails} className="inline-flex me-5 px-4 py-3 border-solid border-[1px] border-[#ddd] rounded-[10px] cursor-pointer hover:bg-[#eee]">Back</button>
                    </div>
                    <ViewSingleDetail noteid={viewnoteDetails} />
                </div>


            </NonSSRWrapper>
        </>
    )
}