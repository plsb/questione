import React from 'react';
import { useTimer } from 'react-timer-hook';

// import { Container } from './styles';

function Timer({ expiryTimestamp, onExpire, setShowTimeDialog }) {
    const {
        seconds,
        minutes,
        hours,
        days,
    } = useTimer({ expiryTimestamp, autoStart: true, onExpire, format: '12-hour' });

    const addZeroToLeft = (value) => {
        if (`${value}`.length === 1) {
            return `0${value}`;
        }

        return value;
    }

    const getTimeColor = (hours, minutes, seconds) => {

        if(parseInt(hours) === 0) {
            // if (parseInt(minutes, 10) === 10 && parseInt(seconds, 10) === 0) {
            //     setShowTimeDialog({
            //         show: true,
            //         message: 'Restam 10 minutos'
            //     });
            // }

            // if (parseInt(minutes, 10) === 20 && parseInt(seconds, 10) === 0) {
            //     setShowTimeDialog({
            //         show: true,
            //         message: 'Restam 20 minutos'
            //     });
            // }

            if (parseInt(minutes, 10) <= 10) {
                return '#ff3030';
            }

            if (parseInt(minutes, 10) <= 20) {
                return '#f57c00';
            }
        }

        return '#3a7cf7';
    };

    return (
        <div className="timer" style={{ width: 'max-content', padding: '0px 4px', fontSize: '30px', fontWeight: 'bold', color: getTimeColor(hours, minutes, seconds) }}>
            {days > 0 && (
                <>
                    <span>{days} dia(s) e </span>
                </>
            )}
            <span>{addZeroToLeft(hours)}</span>h
            <span>{addZeroToLeft(minutes)}</span>min
            {(hours == 0 && minutes < 5) && <span>{addZeroToLeft(seconds)}s</span>}
        </div>
    );
}

export default Timer;
