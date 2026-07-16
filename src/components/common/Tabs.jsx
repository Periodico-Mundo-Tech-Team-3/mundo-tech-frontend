import { useRef } from "react";
import './Tabs.scss';

const Tabs = ({ tabs = [], activeTab, onTabChange, label = 'Filtrar artículos' }) => {
    const tabRefs = useRef([]);

    const handleKeyDown = (event, index) => {
        const lastIndex = tabs.length -1;
        let nextIndex = null;

        if (event.key === 'ArrowRight') nextIndex = index === lastIndex ? 0 : index + 1;
        if (event.key === 'ArrowLeft') nextIndex = index === 0 ? lastIndex : index - 1;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = lastIndex;

        if (nextIndex !== null) {
            event.preventDefault();
            onTabChange(tabs[nextIndex].id);
            tabRefs.current[nextIndex]?.focus();
        }
    };

    return (
        <div className="tabs" role="tablist" aria-label={label}>
            {tabs.map((tab, index) => {
                const isActive = tab.id === activeTab;
                return (
                    <button
                        key={tab.id}
                        ref={(el) => (tabRefs.current[index] = el)}
                        role="tab"
                        id={`tab-${tab.id}`}
                        aria-selected={isActive}
                        tabIndex={isActive ? 0 : -1}
                        className={`tabs__tab${isActive ? ' tabs__tab--active' : ''}`}
                        onClick={() => onTabChange(tab.id)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

export default Tabs;