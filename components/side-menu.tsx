'use client'

import Link from 'next/link'

interface MenuItem {
    label: string
    href: string
    icon?: React.ReactNode
}

const menuItems: MenuItem[] = [
    { label: 'Dashboard', href: '/' },
    { label: 'Sources', href: '/sources' },
    { label: 'List Pages', href: '/list-pages' },
    { label: 'Content Pages', href: '/content-pages' },
    { label: 'Unclassified URLs', href: '/unclassified-urls' },
    { label: 'Fields', href: '/fields' },
    { label: 'Configurations', href: '/configurations' },
    { label: 'Queue', href: '/queue' },
    { label: 'Entries', href: '/entries' },
    { label: 'Users', href: '/users' },
]

export function SideMenu() {
    return (
        <aside className="w-48 min-h-screen bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-800 text-white">
            <div className="p-4">
                <h1 className="text-lg font-bold mb-6 text-white/90">Web Reader</h1>
                
                <nav className="space-y-1">
                    {menuItems.map((item) => (
                        <MenuItem
                            key={item.href}
                            href={item.href}
                            label={item.label}
                        />
                    ))}
                </nav>
            </div>
        </aside>
    )
}

function MenuItem({ href, label }: { href: string; label: string }) {
    return (
        <Link 
            href={href}
            className="block px-3 py-2 rounded-md text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200"
        >
            {label}
        </Link>
    )
} 