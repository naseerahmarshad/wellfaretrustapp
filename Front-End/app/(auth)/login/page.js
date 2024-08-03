'use client'
import { useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BACKEND_URL from '../../config/backendurls';

export default function Login() {
    const router = useRouter();

    // username & password states
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const notify = () => toast.error("Login Failed!");

    const { register, handleSubmit, formState: { errors } } = useForm();

    // handle login function
    const handleLogin = async (data) => {
        try {
            const response = await fetch(`${BACKEND_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify(data),
            });
    
            if (response.ok) {
                router.push('/administrator/');
                const responseData = await response.json();
                if (responseData.token) {
                    Cookies.set('token', responseData.token);
                }
            } else {
                // console.error('Login failed:', response.statusText);
                notify()
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };    

    return (
        <>
            <div className="loginwrapper flex flex-wrap w-full flex-col md:h-lvh md:flex-row">
                <div className='flex justify-center align-middle w-full px-[60px] py-[50px] bg-gray-light3 md:w-[50%]'>
                    <img src='/images/logingraphic.svg' alt='MyNotes' className='md:max-w-[80%]' />
                </div>
                <div className='flex justify-center align-middle w-full p-[50px] md:w-[50%]'>
                    <form onSubmit={handleSubmit(handleLogin)} className='flex flex-col justify-center align-middle w-full max-w-[400px]' autoComplete="off">
                        {/* <h2 className='flex justify-center text-center mb-5 text-[26px] font-semibold'>Welcome!</h2> */}
                        <div className='flex justify-center mb-[40px]'>
                            <img src='/images/mynotes-logo.svg' alt='MyNotes' className='w-[60%]' />
                        </div>
                        <label className='text-[16px] font-medium mb-2'>Username or Email Address</label>
                        <div className='mb-4'>
                            <input type="text" {...register("username", { required: true })} className={`border border-gray-light2 w-full h-[50px] text-gray-dark outline-none px-[10px] rounded-[10px] font-medium shadow ${errors.username ? 'border-red-500' : ''}`} />
                            {errors.username && <span className="inline-flex text-[red] text-[14px] mt-[5px]">Username is required</span>}
                        </div>
                        <label className='text-[16px] font-medium mb-2'>Password</label>
                        <div className='mb-4'>
                            <input type="password" {...register("password", { required: true })} className={`border border-gray-light2 w-full h-[50px] text-gray-dark outline-none px-[10px] rounded-[10px] font-medium shadow ${errors.password ? 'border-red-500' : ''}`} />
                            {errors.password && <span className="inline-flex text-[red] text-[14px] mt-[5px]">Password is required</span>}
                        </div>
                        <div className='flex justify-center mt-3'>
                            <button type="submit" className='w-full bg-primary h-[50px] rounded-[10px] text-white font-medium border-none outline-none hover:bg-secondary'>Login</button>
                        </div>
                        <ToastContainer />
                    </form>
                </div>
            </div>
        </>
    );
}
