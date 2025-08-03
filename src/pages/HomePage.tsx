import React, { useEffect } from 'react';
import HomeForm from '../components/HomeForm';

const HomePage: React.FC = () => {
    useEffect(() => {
        fetch('https://163209aa37f2.ngrok-free.app/health')
            .then(res => res.json())
            .then(data => {
                console.log('Health API response:', data);
            })
            .catch(err => {
                console.error('Health API error:', err);
            });
    }, []);

    return (
        <div>
            <HomeForm />
        </div>
    );
};

export default HomePage;