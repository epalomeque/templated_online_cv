import React, { useState, useRef, useEffect } from 'react';
import './resume_actions.scss';

interface MenuItem {
    id: string;
    label: string;
    icon?: string;
    onClick?: () => void;
    href?: string;
    render?: React.ReactNode;
    children?: MenuItem[];
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
    const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setOpenSubmenus({});
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleSubmenu = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenSubmenus(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleItemClick = (item: MenuItem, e: React.MouseEvent) => {
        if (item.children) {
            toggleSubmenu(item.id, e);
            return;
        }

        if (item.onClick) {
            item.onClick();
        }
        setIsOpen(false);
        setOpenSubmenus({});
    };

    const renderMenuItem = (item: MenuItem, isSubmenu: boolean = false) => {
        if (item.render) {
            return <div key={item.id} onClick={(e) => handleItemClick(item, e)}>{item.render}</div>;
        }

        const hasChildren = !!item.children;
        const isSubOpen = openSubmenus[item.id];

        const content = (
            <>
                {item.icon && <i className={item.icon}></i>}
                <span className="label-text">{item.label}</span>
                {hasChildren && <i className={`fa fa-chevron-${isSubOpen ? 'down' : 'right'} submenu-indicator`}></i>}
            </>
        );

        if (item.href) {
            return (
                <a 
                    key={item.id} 
                    href={item.href} 
                    className={`menu-item ${isSubmenu ? 'submenu-item' : ''}`}
                    onClick={() => {
                        setIsOpen(false);
                        setOpenSubmenus({});
                    }}
                >
                    {content}
                </a>
            );
        }

        return (
            <div key={item.id} className="menu-item-wrapper">
                <button 
                    className={`menu-item ${isSubmenu ? 'submenu-item' : ''} ${hasChildren ? 'has-children' : ''} ${isSubOpen ? 'is-open' : ''}`}
                    onClick={(e) => handleItemClick(item, e)}
                >
                    {content}
                </button>
                {hasChildren && isSubOpen && (
                    <div className="submenu-dropdown">
                        {item.children?.map(child => renderMenuItem(child, true))}
                    </div>
                )}
            </div>
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
