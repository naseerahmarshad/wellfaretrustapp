'use client'
import React, { useState, useEffect } from "react";
import useSWR from 'swr';
import sanitizeHtml from 'sanitize-html';
import BACKEND_URL from "../../../config/backendurls";
import FetcherSWR from "./FetcherSWR";

function ClientOnlyComponent() {
    const { data, error } = useSWR(`${BACKEND_URL}/notes/`, FetcherSWR);

    if (error) return 'Failed to load';
    if (!data) return 'Loading hora...';

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
            <h1>This component will only be rendered on the client side.</h1>
            <h2>Notes</h2>
            <ul>
                {data.map(note => (
                    <li key={note.id}>
                        <strong dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(note.title) }}></strong><br />
                        <span dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(note.contents) }}></span>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default ClientOnlyComponent;