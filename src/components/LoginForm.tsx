"use client";
import React, { useState } from 'react';
import { login } from '../utils/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await login(email, password);
            console.log('Login response:', response); 
            if (response && response.data) {
                localStorage.setItem('token', response.data.token);
                const link = response.data.link.trim(); 

              
                if (!link.startsWith('/')) {
                    router.push(`/${link}`); 
                } else {
                    router.push(link); 
                }
            } else {
                throw new Error('Invalid response structure'); 
            }
        } catch (error: any) {
            console.error('Error:', error); 
            const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials and try again.';
            alert(errorMessage); 
        }
    };

    return (
        <div className='signup flex '>
        <div className="justify-center flex flex-col">
        <p className='text-4xl font-bold'>Log in to your Bento</p>
        <p className='text-xl mt-4 font-light'>Good to have you back!</p>
            <form className="my-8" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input 
                        className='w-full p-3 border border-gray-300 rounded-lg'
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <input 
                        className='w-full p-3 border border-gray-300 rounded-lg'
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className='signupbtn w-full text-md font-semibold bg-black text-white p-3 rounded-lg mt-4'
                >
                    Log In
                </button>
            </form>
            <Link className='text-sm mt-8 font-light' href="/signup">
                            or sign up
                        </Link>
          

            
        </div>

        <div className="rightSignup">
                <img src="/loginpage.png" alt="" />
            </div>
        </div>
    );
};

export default LoginForm;
