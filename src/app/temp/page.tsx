'use client'
import React, { useState } from 'react';

const Counter = () => {
    let [count, setCount] = useState(10);
    const temp = 10;

    const incrementCounter = () => {
        setCount(count + 1);
    };

    return (
        <div>
            <h1>Counter: {count}</h1>
            <button onClick={incrementCounter}>Increment</button>
        </div>
    );
};

export default Counter;