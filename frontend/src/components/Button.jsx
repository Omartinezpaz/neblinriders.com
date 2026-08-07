
import './Button.css';

export default function Button({ children, variant = 'primary', onClick, href, className = '' }) {
  const Component = href ? 'a' : 'button';
  const props = href ? { href } : { onClick };
  
  return (
    <Component 
      className={`nr-btn nr-btn-${variant} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
