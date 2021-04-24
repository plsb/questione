import React from 'react';
import { useTimer } from 'react-timer-hook';

// import { Container } from './styles';

function Timer({ expiryTimestamp, onExpire }) {
    const {
        seconds,
        minutes,
        hours,
    } = useTimer({ expiryTimestamp, autoStart: true, onExpire, format: '12-hour' });

    const addZeroToLeft = (value) => {
        if (`${value}`.length === 1) {
            return `0${value}`;
        }

        return value;
    }

    const getTimeColor = (minutes) => {
        if (parseInt(minutes, 10) <= 10) {
            return '#ff3030';
        }

        if (parseInt(minutes, 10) <= 20) {
            return '#0000ff';
        }

        return '#546e7a';
    };

    return (
        <div className="timer" style={{ width: 'max-content', padding: '0px 4px', fontWeight: 'bold', color: getTimeColor(minutes) }}>
            <span>{addZeroToLeft(hours)}</span>:<span>{addZeroToLeft(minutes)}</span>:<span>{addZeroToLeft(seconds)}</span>
        </div>
    );
}

export default Timer;