import { useEffect, useRef } from 'react';

/**
 * Hook que mide el alto real del header y lo escribe como variable CSS
 * --nr-header-height en :root. Se actualiza automáticamente con ResizeObserver
 * cuando el header cambia de tamaño (ej. en móvil el topbar hace wrap).
 */
export function useHeaderHeight() {
  const headerRef = useRef(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const setHeightVar = () => {
      const height = header.offsetHeight;
      document.documentElement.style.setProperty('--nr-header-height', `${height}px`);
    };

    setHeightVar();

    const resizeObserver = new ResizeObserver(setHeightVar);
    resizeObserver.observe(header);

    return () => resizeObserver.disconnect();
  }, []);

  return headerRef;
}
