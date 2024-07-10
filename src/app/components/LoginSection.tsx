'use client'
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Navbar } from './Navbar';

interface LoginProps {
    destination: string
}

export default function LoginSection(props: LoginProps) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/login/', {
                username,
                password
            });

            if (response.data && response.data.access_token) {
                localStorage.setItem('ruralcompany', response.data.access_token);
                router.push(`/${props.destination}`); // Redirect to home or another page after login
            } else {
                setError('Invalid login credentials.');
            }
        } catch (err) {
            setError('Error logging in. Please try again.');
        }
    };

    return (
        <>
            <div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form className='w-80 flex flex-col border-2 border-black rounded-lg p-4' onSubmit={handleLogin}>
                    <div className='flex flex-col'>
                        <label htmlFor="username">Email</label>
                        <input
                         className='border-2 border-black'
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    {/* <div>
          <label htmlFor="email">Email</label>
          <input
          type="username"
          id="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          />
          </div> */}
                    <div className='flex flex-col'>
                        <label htmlFor="password">Password</label>
                        <input
                         className='border-2 border-black'
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded" type="submit">Login</button>
                </form>
            </div>
        </>
    );
};
