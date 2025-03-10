import React, { ReactNode, useState, useRef, useEffect } from 'react';

interface DropdownProps {
    trigger: ReactNode;
    children: ReactNode;
    closeOnClickOutside?: boolean;
    closeOnClickInMenu?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
    trigger,
    children,
    closeOnClickOutside = true,
    closeOnClickInMenu = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const [currentTopPosition, setCurrentTopPosition] = useState<number | null>(null);
    const [currentLeftPosition, setCurrentLeftPosition] = useState<number | null>(null);

    // Toggle dropdown state
    const toggleDropdown = () => setIsOpen(!isOpen);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (closeOnClickOutside && isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, closeOnClickOutside]);

    // Prevent overbound menu from being cut off the screen
    useEffect(() => {
        if (isOpen && menuRef.current && dropdownRef.current && wrapperRef.current) {
            const { innerHeight, innerWidth } = window;
            const {
                top: dropdownTop,
                left: dropdownLeft,
                right: dropdownRight,
                width: dropdownWidth,
                height: dropdownHeight,
                bottom: dropdownBottom,
            } = dropdownRef.current.getBoundingClientRect();

            const {
                width: menuWidth,
                height: menuHeight,
            } = menuRef.current.getBoundingClientRect();

            // Position the dropdown directly below the trigger
            let topPosition = dropdownBottom;

            // If there isn’t enough space below, position it above
            if (dropdownBottom + menuHeight > innerHeight) {
                topPosition = dropdownTop - menuHeight;
            }
            setCurrentTopPosition(topPosition);

            // Center the dropdown horizontally with the trigger
            let leftPosition = dropdownLeft + dropdownWidth / 2 - menuWidth / 2;
            if (leftPosition < 0) {
                leftPosition = 0; // Align to left if overflow
            } else if (leftPosition + menuWidth > innerWidth) {
                leftPosition = innerWidth - menuWidth; // Align to right if overflow
            }
            setCurrentLeftPosition(leftPosition);
        }
    }, [isOpen]);

    return (
        <div ref={wrapperRef} className="flex-col cursor-pointer overflow-visible">
            <div ref={dropdownRef} onClick={toggleDropdown} className='w-fit h-fit'>{trigger}</div>
            {isOpen && (
                <div ref={menuRef} onClick={closeOnClickInMenu ? toggleDropdown : undefined}
                    className="fixed m-2 p-2 bg-white dark:bg-gray-700 shadow-md border rounded w-fit z-50"
                    style={{
                        top: `${currentTopPosition}px`,
                        left: `${currentLeftPosition}px`,
                    }}
                >
                    {children}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
