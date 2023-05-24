import React, { useState, useEffect } from 'react';

const MMSSCountdown = ({ date }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    function calculateTimeLeft() {
        const difference = +new Date(date) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        else {
            timeLeft = {
                minutes: 0,
                seconds: 0,
            };
        }

        return timeLeft;
    }

    const { minutes, seconds } = timeLeft;

    return (
        <div className='bg-gray-800 text-gray-200 rounded-xl px-2'>
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
    );
};

export default MMSSCountdown;
