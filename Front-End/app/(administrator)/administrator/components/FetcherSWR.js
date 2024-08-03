import React from "react";

const FetcherSWR = async (url) => {
    const headersList = {
        "Accept": "application/json",
    };
    const response = await fetch(url, {
        method: "GET",
        headers: headersList
    });
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    return response.json();
};

export default FetcherSWR;