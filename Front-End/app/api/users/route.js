import { NextResponse } from "next/server";

export function GET(request) {
    const users = [
        {
            name: 'Arshad',
            Age: '38',
            Designation: 'Designer'
        },
        {
            name: 'Ahmed',
            Age: '40',
            Designation: 'Developer'
        }
    ];
     return NextResponse.json(users);
}