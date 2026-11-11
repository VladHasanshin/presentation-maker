import styles from './Button.module.css';

interface ButtonProps {
    text: string;
    className?: string;
    disabled?: boolean; 
    onClick: () => void;
}

function Button({text, className, disabled = false, onClick}: ButtonProps) {
    return (
        <button className={`${styles.button} ${className ?? ''}`} onClick = {onClick} disabled={disabled}>
            {text}
        </button>
    );
}

export {
    Button
};