'use client';

import Link from "next/link";
import React, {useState} from "react";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'

export default function Sidebar() {

    const router = useRouter();

    // open menu
    const [responsiveBtn, setResponsiveBtn] = useState(true);
    const responsiveBtnClickHandler = (e) => {
        e.preventDefault();
        setResponsiveBtn(!responsiveBtn);
    }

    // close menu
    function closeMenu() {
        setResponsiveBtn(responsiveBtn);
    }

    // Function to handle button click to remove access token
    const handleRemoveToken = () => {
        Cookies.remove('token');
        console.log('Access token removed from local storage manually');
        router.push('/login');
    };

    return (
        <>
            <div className="sidebarcol">
                <div className="innersidebar">
                    <img src="/images/mynotes-logo.svg" alt="MyNotes" />
                    <div className="sidebarcol-respbtn" onClick={responsiveBtnClickHandler}>
                        <img src="/images/menuicon.svg" alt="menuicon" />
                    </div>
                </div>

                {/* sidebarcol-linkwrapper */}
                <div className={responsiveBtn ? "sidebarcol-linkwrapper" : "sidebarcol-linkwrapper-active"}>
                    <div className="sidebarlinks topsidebar">
                        <ul>
                            <li>
                                <Link href='/administrator/' onClick={closeMenu}><img src="/images/icon5.svg" alt="icons" /> Dashboard</Link>
                            </li>
                            <li>
                                <Link href='/administrator/add-new-note' onClick={closeMenu}><img src="/images/icon1.svg" alt="icons" /> Add new note</Link>
                            </li>
                            <li>
                                <Link href='/administrator/view-all-notes' onClick={closeMenu}><img src="/images/icon2.svg" alt="icons" /> View All</Link>
                            </li>
                            <li>
                                <Link href='/administrator/trash' onClick={closeMenu}><img src="/images/trashicon.svg" alt="icons" /> Trash Items</Link>
                            </li>
                            <li>
                                <Link href='/administrator/settings' onClick={closeMenu}><img src="/images/icon3.svg" alt="icons" /> Settings</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="sidebarlinks bottomsidebar">
                        <ul>
                            <li>
                                <Link href='/login' onClick={handleRemoveToken}><img src="/images/icon4.svg" alt="icons" /> Logout</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}