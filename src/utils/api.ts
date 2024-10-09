import axios from 'axios';

const API_URL = 'http://localhost:8000/api/users/';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export type SocialLinks = {
    instagram: string;
    linkedin: string;
    github: string;
    youtube: string;
    dribble: string;
    figma: string;
    behance: string;
    x: string; 
};

export type SocialLinksWithOwner = SocialLinks & {
    ownerId: string; 
};

export const signup = async (name: string, email: string, password: string, link: string) => {
    return await axios.post(`${API_URL}signup`, { name, email, password, link });
};

export const login = async (email: string, password: string) => {
    return await axios.post(`${API_URL}login`, { email, password });
};

export const checkLinkAvailability = async (link: string) => {
    try {
        const response = await axios.post(`${API_URL}check-link`, { link });
        return response.data; // Handle response as needed
    } catch (error) {
        console.error('Error checking link availability:', error);
        throw new Error('Failed to check link availability'); // Propagate error
    }
};

export const saveLinks = async (links: Record<string, string>): Promise<void> => {
    await axios.post(`${API_URL}save-links`, { links }, { headers: getAuthHeaders() });
};

export const getLinks = async (link: string): Promise<SocialLinksWithOwner | null> => {
    try {
        const response = await axios.get(`${API_URL}get-links`, {
            headers: getAuthHeaders(),
        });
        return response.data.links; 
    } catch (error) {
        console.error('Error fetching links:', error);
        return null;
    }
};

export const updateUserDetails = async (details: any) => {
    const token = localStorage.getItem('token');
    await axios.put(`${API_URL}update`, details, {
      headers: { Authorization: `Bearer ${token}` }
    });
};

export const getCurrentUser = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}current-user`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data; 
};

export const getPublicProfile = async (link: string) => {
    const response = await axios.get(`${API_URL}profile/${link}`);
    return response.data;
};
