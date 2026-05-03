export default function ApplicationLogo({ className = '', style = {} }) {
    return (
        <img
            src="/images/logo.png"
            alt="Smart Invitation Logo"
            className={className}
            style={{
                height: '48px',
                width: 'auto',
                objectFit: 'contain',
                ...style,
            }}
        />
    );
}
