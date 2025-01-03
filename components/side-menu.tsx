'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
    HomeIcon, LayersIcon, ListIcon, FileTextIcon, 
    SettingsIcon, UsersIcon, 
    InboxIcon, DatabaseIcon, LinkIcon,
    ChevronLeftIcon, ChevronRightIcon
} from 'lucide-react'
import { Tooltip } from './tooltip'

interface MenuItem {
    label: string
    href: string
    icon: React.ReactNode
}

const menuItems: MenuItem[] = [
    { label: 'Dashboard', href: '/', icon: <HomeIcon className="w-5 h-5" /> },
    { label: 'Sources', href: '/sources', icon: <LayersIcon className="w-5 h-5" /> },
    { label: 'List Pages', href: '/list-pages', icon: <ListIcon className="w-5 h-5" /> },
    { label: 'Content Pages', href: '/content-pages', icon: <FileTextIcon className="w-5 h-5" /> },
    { label: 'Unclassified URLs', href: '/unclassified-urls', icon: <LinkIcon className="w-5 h-5" /> },
    { label: 'Fields', href: '/fields', icon: <DatabaseIcon className="w-5 h-5" /> },
    { label: 'Configurations', href: '/configurations', icon: <SettingsIcon className="w-5 h-5" /> },
    { label: 'Queue', href: '/queue', icon: <InboxIcon className="w-5 h-5" /> },
    { label: 'Entries', href: '/entries', icon: <FileTextIcon className="w-5 h-5" /> },
    { label: 'Users', href: '/users', icon: <UsersIcon className="w-5 h-5" /> },
]

export function SideMenu() {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <aside className={`${isCollapsed ? 'w-16' : 'w-48'} min-h-screen bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-800 text-white transition-all duration-300 relative`}>
            <div className="p-4">
                <h1 className={`text-lg font-bold mb-6 text-white/90 overflow-hidden ${isCollapsed ? 'text-center' : ''}`}>
                    {isCollapsed ? 'WR' : 'Web Reader'}
                </h1>
                
                <nav className="space-y-1">
                    {menuItems.map((item) => (
                        <MenuItem
                            key={item.href}
                            href={item.href}
                            label={item.label}
                            icon={item.icon}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </nav>
            </div>
            
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-6 bg-blue-600 rounded-full p-1 hover:bg-blue-700 transition-colors"
            >
                {isCollapsed ? 
                    <ChevronRightIcon className="w-4 h-4" /> : 
                    <ChevronLeftIcon className="w-4 h-4" />
                }
            </button>
        </aside>
    )
}

function MenuItem({ href, label, icon, isCollapsed }: { 
    href: string
    label: string
    icon: React.ReactNode
    isCollapsed: boolean 
}) {
    return (
        <Tooltip content={label} enabled={isCollapsed}>
            <Link 
                href={href}
                className="block px-3 py-2 rounded-md text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200"
            >
                <div className="flex items-center gap-3">
                    {icon}
                    {!isCollapsed && <span>{label}</span>}
                </div>
            </Link>
        </Tooltip>
    )
} 