import React from "react";
import dynamic from 'next/dynamic';
import LoaderComponent from "./Loadercomponent";
const NonSSRWrapper = props => (
    <>
        {props.children}
    </>
) 
export default dynamic(() => Promise.resolve(NonSSRWrapper), { 
    ssr: false,
    loading: () => {
        return (
            <>
                <LoaderComponent />
            </>
        )
    }
})