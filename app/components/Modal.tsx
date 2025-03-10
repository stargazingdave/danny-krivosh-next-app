'use client';

import { ReactNode, useEffect } from 'react';
import { HiXMark } from 'react-icons/hi2';

const widthMap = {
    sm: '20rem',
    md: '30rem',
    lg: '40rem',
    xl: '50rem',
};

interface ModalProps {
    open: boolean;
    onClose?: () => void;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface ModalHeadProps {
    children: ReactNode;
    onClose?: () => void;
}

interface ModalBodyProps {
    children: ReactNode;
}

interface ModalFooterProps {
    children: ReactNode;
}

export function Modal({ open, onClose, children, size = 'md' }: ModalProps) {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && onClose) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-end z-50">
            <div className="flex flex-col m-8 bg-white dark:bg-gray-800 rounded shadow-lg w-full min-h-64 max-h-full overflow-hidden" style={{ maxWidth: widthMap[size] }}>
                {children}
            </div>
        </div>
    );
}

Modal.Head = function ModalHead({ children, onClose }: ModalHeadProps) {
    return (
        <div className="flex justify-between bg-gray-200 dark:bg-gray-600">
            <div className='w-full h-full'>{children}</div>
            {onClose && (
                <button
                    className="flex m-1 w-8 h-8 items-center justify-center hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-800 rounded"
                    onClick={onClose}
                >
                    <HiXMark />
                </button>
            )}
        </div>
    );
};

Modal.Body = function ModalBody({ children }: ModalBodyProps) {
    return <div className="flex flex-col grow mb-4 overflow-auto">{children}</div>;
};

Modal.Footer = function ModalFooter({ children }: ModalFooterProps) {
    return <div className="flex w-full h-fit bg-gray-200 dark:bg-gray-600">{children}</div>;
};
