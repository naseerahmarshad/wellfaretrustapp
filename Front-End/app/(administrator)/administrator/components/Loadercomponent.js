'use client'
import React from "react"

export default function LoaderComponent() {
    return (
        <>
            <div className="customloader" id="customloader">
                <div>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <strong>
                    Loading...
                </strong>
            </div>,
        </>
    )
}