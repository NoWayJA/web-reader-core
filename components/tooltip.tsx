interface TooltipProps {
    children: React.ReactNode
    content: string
    enabled: boolean
}

export function Tooltip({ children, content, enabled }: TooltipProps) {
    if (!enabled) return <>{children}</>
    
    return (
        <div className="relative group">
            {children}
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white text-sm px-2 py-1 rounded whitespace-nowrap shadow-lg">
                    {content}
                </div>
            </div>
        </div>
    )
} 