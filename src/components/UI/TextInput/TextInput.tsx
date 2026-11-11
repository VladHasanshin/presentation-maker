import { useEffect, useRef } from 'react';
import styles from './TextInput.module.css'

// Не сохраняется размер текстового обьекта при изменении текста.
interface TextInputProps {
    value: string;
    placeholder?: string;
    type?: 'text' | 'color' | 'number' | 'textarea';
    className?: string;
    style?: React.CSSProperties;
    autoFocus?: boolean;
    onChange?: (value: string) => void;
    onBlur?: () => void;
}

function TextInput({value, placeholder, type, className, style, autoFocus = false, onChange, onBlur}: TextInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (type !== 'textarea') return;
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    }, [value, type]);

    if (type === 'textarea') {
        return (
            <textarea
                ref={textareaRef}
                className={`${styles.input} ${className ?? ''}`}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange?.(e.target.value)}
                onBlur={onBlur}
                style={style}
                autoFocus={autoFocus}
            />    
        );
    }

    return (
        <input
            type={type}
            className={`${styles.input} ${className ?? ''}`}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange?.(e.target.value)}
            onBlur={onBlur}
            style={style}
        />
    );
}

export {
    TextInput
}