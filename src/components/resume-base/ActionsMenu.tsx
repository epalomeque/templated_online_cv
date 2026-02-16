import React, { useState, useRef, useEffect } from 'react';
import './resume_actions.scss';

interface MenuItem {
    id: string;
    label: string;
    icon?: string;
    onClick?: () => void;
    href?: string;
    render?: React.ReactNode;
}

interface ActionsMenuProps {
    items: MenuItem[];
    triggerLabel?: string;
    triggerIcon?: string;
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({ 
    items, 
    triggerLabel = 'Acciones',
    triggerIcon = 'fa fa-bars' 
}: ActionsMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleItemClick = (item: MenuItem) => {
        if (item.onClick) {
            item.onClick();
        }
        setIsOpen(false);
    };

    const renderMenuItem = (item: MenuItem) => {
        if (item.render) {
            return <div key={item.id} onClick={() => handleItemClick(item)}>{item.render}</div>;
        }

        const content = (
            <>
                {item.icon && <i className={item.icon}></i>}
                <span>{item.label}</span>
            </>
        );

        if (item.href) {
            return (
                <a 
                    key={item.id} 
                    href={item.href} 
                    className="menu-item"
                    onClick={() => setIsOpen(false)}
                >
                    {content}
                </a>
            );
        }

        return (
            <button 
                key={item.id} 
                className="menu-item"
                onClick={() => handleItemClick(item)}
            >
                {content}
            </button>
        );
    };

    return (
        <div className="actions-menu" ref={menuRef}>
            <button 
                className="menu-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <i className={triggerIcon}></i>
                {triggerLabel && <span>{triggerLabel}</span>}
                <i className={`fa fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
            </button>
            
            {isOpen && (
                <div className="menu-dropdown" role="menu">
                    {items.map((item) => (
                        <React.Fragment key={item.id}>
                            {renderMenuItem(item)}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActionsMenu;
