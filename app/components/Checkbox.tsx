import React from "react";
import { IoCheckmarkSharp } from "react-icons/io5";

interface CheckboxProps {
    label?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
    label,
    checked,
    onChange,
    disabled = false,
    className = "",
}) => {
    return (
        <label className={`flex items-center gap-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange && onChange(e.target.checked)}
                disabled={disabled}
                className="hidden"
            />
            <div
                className={`w-5 h-5 flex items-center justify-center border rounded transition-all border-gray-400 ${checked && "bg-black"
                    }`}
            >
                {checked && (
                    <IoCheckmarkSharp />
                )}
            </div>
            {label && <span>{label}</span>}
        </label>
    );
};

export default Checkbox;
