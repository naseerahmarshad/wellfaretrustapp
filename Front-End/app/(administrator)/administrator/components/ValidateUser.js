'use client'

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';
import BACKEND_URL from "../../../config/backendurls";

export default function ValidateUser() {

    const router = useRouter();

    useEffect(() => {
        async function fetchDataToValidate() {
            try {
                // let accessToken = localStorage.getItem('token');
                let accessToken = Cookies.get('token');
                if (!accessToken) {
                    router.push('/login');
                    return;
                }

                let headersList = {
                    'Accept': '*/*',
                    'Authorization': `Bearer ${accessToken}`
                }

                let response = await fetch(`${BACKEND_URL}/validateuser`, {
                    method: 'GET',
                    headers: headersList
                });

                let authdata = await response.text();
                // console.log('Tocken data: ', authdata);
                // console.log(authdata === 'Token invalid');

                if (response.status === 403) {
                    // Handle 403 error (Forbidden)
                    router.push('/login');
                    return;
                }

                if (!response.ok) {
                    // Handle other errors
                    throw new Error('Network response was not ok');
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                router.push('/login');
            }
        }
        fetchDataToValidate();
    }, []);
}