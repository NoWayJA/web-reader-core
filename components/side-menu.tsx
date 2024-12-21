'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

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
    { label: 'Configurations', href: '/configurations' },
    { label: 'Fields', href: '/fields' },
    { label: 'Queue', href: '/queue' },
    { label: 'Entries', href: '/entries' },
    { label: 'Indicators', href: '/indicators' },
    { label: 'Users', href: '/users' },
]

export function SideMenu() {
    const pathname = usePathname()

    return (
        <nav className="flex flex-col w-64 h-screen bg-gray-50 border-r">
            <div className="p-4">
                <h1 className="text-xl font-bold">Web Reader Core</h1>
            </div>

            <div className="flex-1 px-3">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center px-4 py-2 mt-2 text-gray-600 rounded-lg hover:bg-gray-100',
                            pathname === item.href && 'bg-gray-100 text-gray-900 font-medium'
                        )}
                    >
                        {item.icon && <span className="mr-3">{item.icon}</span>}
                        {item.label}
                    </Link>
                ))}
            </div>
        </nav>
    )
} 