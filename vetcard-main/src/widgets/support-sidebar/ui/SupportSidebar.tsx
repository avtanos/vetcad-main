import React from 'react';

interface Section {
    id: string;
    label: string;
}

interface SupportSidebarProps {
    sections: Section[];
    activeId: string;
}

export const SupportSidebar = ({ sections, activeId }: SupportSidebarProps) => {

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            window.history.pushState(null, '', `#${id}`);
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            window.history.pushState(null, '', `#${id}`);
        }
    };

    return (
        <>
         
            <div className="lg:hidden mb-8">
                <label htmlFor="support-nav" className="text-sm font-semibold text-slate-900 tracking-wider uppercase">Навигация по разделу</label>
                <select
                    id="support-nav"
                    value={activeId}
                    onChange={handleSelectChange}
                    className="w-full mt-2 p-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                    {sections.map(section => (
                        <option key={section.id} value={section.id}>
                            {section.label}
                        </option>
                    ))}
                </select>
            </div>

         
            <aside className="w-64 flex-shrink-0 hidden lg:block sticky top-24 h-fit">
                <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">Навигация</h3>
                <nav className="mt-4">
                    <ul className="space-y-2">
                        {sections.map(section => {
                            const isActive = activeId === section.id;
                            return (
                                <li key={section.id}>
                                    <a
                                        href={`#${section.id}`}
                                        onClick={(e) => handleLinkClick(e, section.id)}
                                        className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            isActive
                                                ? 'bg-teal-50 text-teal-600'
                                                : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        {section.label}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>
        </>
    );
};