import { useEffect, useRef } from 'react';

// check when click outside element
export const handleClickOutside = (callback: any) => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClick = (event: any) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [ref]);

    return ref;
};
