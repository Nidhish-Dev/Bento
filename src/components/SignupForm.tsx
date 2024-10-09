'use client';
import React, { useState } from 'react';
import { signup } from '../utils/api';
import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react'; 
import Link from 'next/link';

const SignupForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [link, setLink] = useState(''); 
    const [error, setError] = useState('');
    const [isLinkConfirmed, setIsLinkConfirmed] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await signup(name, email, password, `/${link.trim()}`); 
            localStorage.setItem('token', response.data.token);
            router.push('/login'); 
        } catch (error: any) {
            console.error('Error:', error.response?.data || error);
            setError('Failed to sign up. Please check your details and try again.'); 
        }
    };

    const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace('https://bento-server-liart.vercel.app/', ''); 
        setLink(value); 
    };

    const handleConfirmLink = () => {
        // Confirm the link and show the signup form
        setIsLinkConfirmed(true);
    };

    const handleBackClick = () => {
        // Go back to link input state
        setIsLinkConfirmed(false);  
    };

    return (
        <div className='signup flex'>
            <div className="leftSignup justify-center flex flex-col">
                {!isLinkConfirmed ? (
                    <>
                        <p className='text-4xl font-bold'>First, claim your unique link</p>
                        <p className='text-xl mt-4 font-light'>The good ones are still available!</p>
                        <div className="relative mt-16">
                            <input 
                                className='grabmylinkinput w-full pl-4 pr-10 placeholder-gray-500' 
                                type="text" 
                                placeholder="Enter your unique link" 
                                value={`https://bento-server-liart.vercel.app/${link}`} 
                                onChange={handleLinkChange} 
                            />
                        </div>

                        <button
                            className='grabmylinkbtn flex justify-center mt-3 text-lg font-semibold'
                            onClick={handleConfirmLink}  
                        >
                            Grab my Link
                        </button>

                        <Link className='text-sm mt-8 font-light' href="/login">
                            or Log in
                        </Link>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2">
                            <IconArrowLeft 
                                size={24} 
                                onClick={handleBackClick} 
                                className="cursor-pointer text-black" 
                            />
                        </div>

                        <p className='text-lg mt-4 font-light'>{`https://bento-server-liart.vercel.app/${link}`} is yours!</p>
                        <p className='text-4xl font-bold'>Now, create your account.</p>
                        <form onSubmit={handleSubmit} className="mt-8">
                            {error && <p className="mt-4 text-red-500">{error}</p>} 
                            <div className="mb-4">
                                <input 
                                    className='w-full p-3 border border-gray-300 rounded-lg'
                                    type="text"
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
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
                                Create Account
                            </button>
                        </form>
                    </>
                )}
            </div>
            
            <div className="rightSignup">
                <img src="/grabmylinkpage.png" alt="" />
            </div>
        </div>
    );
};

export default SignupForm;
