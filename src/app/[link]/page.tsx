'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveLinks, getLinks, getCurrentUser, SocialLinksWithOwner } from '@/utils/api'; 
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { IconClipboardCopy } from "@tabler/icons-react";

type SocialLinks = {
    instagram: string;
    linkedin: string;
    github: string;
    youtube: string;
    dribble: string;
    figma: string;
    behance: string;
    x: string;
};

interface Params {
    params: {
        link: string;
    };
}

const LinkPage: React.FC<Params> = ({ params }) => {
    const [socialLinks, setSocialLinks] = useState<SocialLinks>({
        x: '@',
        instagram: '@',
        linkedin: '@',
        github: '@',
        youtube: '@',
        dribble: '@',
        figma: '@',
        behance: '@',
    });
    const [name, setName] = useState<string>('');
    const [linksSaved, setLinksSaved] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [error, setError] = useState<string>(''); 
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const router = useRouter();

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token'); // Check for the token
            if (!token) {
                router.push('/login'); // Redirect to login if no token
                return;
            }

            try {
                const userDetails = await getCurrentUser();
                if (userDetails) {
                    setName(userDetails.name);
                    setIsOwner(userDetails.link === params.link);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                setError('Unauthorized access. Please log in.'); // Show error message
                router.push('/login'); // Redirect to login on error
            }
        };

        const fetchLinks = async () => {
            const token = localStorage.getItem('token'); // Check for the token
            if (!token) {
                router.push('/login'); // Redirect to login if no token
                return;
            }

            try {
                const existingLinks: SocialLinksWithOwner | null = await getLinks(params.link);
                setLinksSaved(!!existingLinks);

                if (existingLinks) {
                    setSocialLinks(existingLinks); 
                }
            } catch (error) {
                console.error('Error fetching links:', error);
                setError('Failed to fetch links.'); // Show error message
            }
        };

        fetchUserDetails(); 
        fetchLinks(); 
    }, [params.link, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSocialLinks(prevState => ({
            ...prevState,
            [name as keyof SocialLinks]: value.startsWith('@') ? value : `@${value}`,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = Object.fromEntries(
            Object.entries(socialLinks).map(([key, value]) => [key, value])
        );

        setIsSubmitting(true);
        try {
            await saveLinks(data);
            setLinksSaved(true);
            setError('');
        } catch (error: any) {
            console.error('Error saving links:', error);
            setError('Failed to save links. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const socialMediaUrls: { [key: string]: string } = {
        instagram: 'https://instagram.com/',
        linkedin: 'https://linkedin.com/in/',
        github: 'https://github.com/',
        youtube: 'https://youtube.com/@',
        dribble: 'https://dribbble.com/',
        figma: 'https://figma.com/@',
        behance: 'https://behance.net/',
        x: 'https://twitter.com/',
    };

    const copyUrlToClipboard = () => {
        const currentUrl = window.location.href; 
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                alert('URL copied to clipboard!');
            })
            .catch(err => {
                console.error('Error copying URL: ', err);
            });
    };

    return (
        <div className="flex flex-col mt-16 mb-16">
            {!linksSaved ? (
                isOwner ? (
                    <div className='ml-10'>
                        <p className='text-3xl font-semibold'>Now, let&apos;s add your social media</p>
                        <p className='text-3xl font-semibold'>accounts to your page.</p>
                        
                        <form onSubmit={handleSubmit} className="links">
                            {Object.keys(socialLinks).map((key) => (
                                <div className="linkItem flex items-center mt-5" key={key}>
                                    <img src={`/${key}.png`} alt={key} /> 
                                    <input
                                        name={key}
                                        className='ml-2 border p-2 rounded'
                                        type="text"
                                        value={socialLinks[key as keyof SocialLinks]} 
                                        onChange={handleChange}
                                        placeholder={`Your ${key}`}
                                    />
                                </div>
                            ))}

                            <button 
                                type="submit" 
                                className="copybtn text-white mt-4"
                                disabled={isSubmitting} 
                            >
                                {isSubmitting ? 'Saving...' : 'Save Links'}
                            </button>

                            {error && <p className="mt-4 text-red-500">{error}</p>} 
                        </form>
                    </div>
                ) : (
                    <p>Loading...</p>
                )
            ) : (
                <div className='flex flex-col items-center'>
                    <div className="flex justify-center mb-10"> 
                        <div className="head flex flex-col items-center">
                            <img src="/logo.png" className="justify-center" alt="Logo" />
                            <p className='text-2xl font-bold mt-3'>Bento</p>
                        </div>
                    </div>
                    <BentoGrid className="max-w-4xl mx-auto ">
                        <BentoGridItem
                            title={name}
                            header={<Skeleton />}
                            icon={<IconClipboardCopy className="h-4 w-4 text-neutral-500" />}
                        />
                        {Object.entries(socialLinks).map(([key, value]) => (
                            <div key={key} onClick={() => window.open(socialMediaUrls[key] + value.slice(1), '_blank')}>
                                <BentoGridItem
                                    title={key.charAt(0).toUpperCase() + key.slice(1)}
                                    description={`Visit your ${key} profile`}
                                    header={<img src={`/${key}.png`} alt={key} className="w-10 h-10" />}
                                    icon={<IconClipboardCopy className="h-4 w-4 text-neutral-500" />}
                                />
                            </div>
                        ))}
                    </BentoGrid>

                    <button
                        onClick={copyUrlToClipboard}
                        className="copybtn text-white"
                    >
                        Copy URL
                    </button>

                  
                </div>
            )}
        </div>
    );
};

const Skeleton = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-blue-200"></div>
);

export default LinkPage;
