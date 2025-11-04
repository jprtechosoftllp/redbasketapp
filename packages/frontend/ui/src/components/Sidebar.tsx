"use client"

import { ChevronDown, ChevronRight, Settings, Bell, X, Menu, Zap, CircleUser } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import Image from 'next/image'

interface SubLink {
    name: string;
    href: string;
    icon?: React.ReactNode;
}

interface NavLink {
    name: string;
    icon: React.ReactNode;
    subLinks?: SubLink[];
    badge?: string;
}

export default function SidebarComponent(
    { children, isMobileMenuOpen, setIsMobileMenuOpen, isMobile, navLinks, data }
        :
        { children: React.ReactNode, isMobileMenuOpen: boolean, setIsMobileMenuOpen: (value: boolean) => void, isMobile: boolean, navLinks: NavLink[], data?: { username: string, photo: string, email: string } }
) {

    const [isDesktopOpen, setIsDesktopOpen] = useState(true);
    const [expandedItems, setExpandedItems] = useState<string[]>(['Dashboard']);
    const [activeLink, setActiveLink] = useState('');
    const [client, setClient] = useState(false)

    const toggleExpand = (name: string) => {
        setExpandedItems(prev =>
            prev.includes(name)
                ? prev.filter(item => item !== name)
                : [...prev, name]
        );
    };

    const handleSubLinkClick = (name: string) => {
        setActiveLink(name);
        if (isMobile) {
            setIsMobileMenuOpen(false);
        }
    };

    useEffect(() => {
        setClient(true)
    }, [children])

    const sidebarWidth = isMobile ? 'w-full' : (isDesktopOpen ? 'lg:w-72' : 'lg:w-20');

    return (
        client && <div className="flex h-screen bg-zinc-950 overflow-hidden">
            {/* Mobile Overlay */}
            {isMobile && isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`${isMobile
                    ? `fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full hidden'
                    }`
                    : `${sidebarWidth} transition-all duration-300`
                    } bg- border-r border-zinc-800 flex flex-col relative`}
            >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent pointer-events-none" />

                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800 relative z-10 shrink-0">
                    <div className={`flex items-center gap-3 ${!isMobile && !isDesktopOpen && 'lg:justify-center lg:w-full'}`}>
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        {(isMobile || isDesktopOpen) && (
                            <div>
                                <span className="font-bold text-lg text-white">{data?.username}</span>
                                {/* <p className="text-xs text-zinc-500">v2.0</p> */}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => isMobile ? setIsMobileMenuOpen(false) : setIsDesktopOpen(!isDesktopOpen)}
                        className="p-2 rounded-lg hover:bg-zinc-800 transition-colors lg:hidden text-zinc-400 hover:text-white"
                    >
                        {(isMobile && isMobileMenuOpen) || (!isMobile && isDesktopOpen) ? (
                            <X className="w-4 h-4" />
                        ) : (
                            <Menu className="w-4 h-4" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 relative z-10 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    <ul className="space-y-1">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <div>
                                    <button
                                        // href={link.href}
                                        onClick={() => link.subLinks && toggleExpand(link.name)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group hover:bg-zinc-800/50 relative overflow-hidden`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                        <div className="flex items-center gap-3 relative z-10">
                                            <span className="text-zinc-400 group-hover:text-violet-400 transition-colors shrink-0">
                                                {link.icon}
                                            </span>
                                            {(isMobile || isDesktopOpen) && (
                                                <span className="font-medium text-zinc-300 group-hover:text-white transition-colors">
                                                    {link.name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 relative z-10">
                                            {(isMobile || isDesktopOpen) && link.badge && (
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${link.badge === 'Pro'
                                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                                    : 'bg-violet-500/20 text-violet-400'
                                                    }`}>
                                                    {link.badge}
                                                </span>
                                            )}
                                            {(isMobile || isDesktopOpen) && link.subLinks && (
                                                <span className="text-zinc-500 group-hover:text-violet-400 transition-colors shrink-0">
                                                    {expandedItems.includes(link.name) ? (
                                                        <ChevronDown className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4" />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </button>

                                    {/* Sublinks */}
                                    {link.subLinks && expandedItems.includes(link.name) && (isMobile || isDesktopOpen) && (
                                        <ul className="mt-1 ml-4 space-y-0.5 border-l-2 border-zinc-800 pl-4">
                                            {link.subLinks.map((subLink) => (
                                                <li key={subLink.name}>
                                                    <Link
                                                        href={subLink.href}
                                                        onClick={() => handleSubLinkClick(subLink.name)}
                                                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 group ${activeLink === subLink.name
                                                            ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 border border-violet-500/30'
                                                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                                                            }`}
                                                    >
                                                        {subLink.icon && (
                                                            <span className={`transition-colors shrink-0 ${activeLink === subLink.name
                                                                ? 'text-violet-400'
                                                                : 'text-zinc-500 group-hover:text-violet-400'
                                                                }`}>
                                                                {subLink.icon}
                                                            </span>
                                                        )}
                                                        <span className="font-medium truncate">{subLink.name}</span>
                                                        {activeLink === subLink.name && (
                                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shrink-0" />
                                                        )}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-zinc-800 relative z-10 shrink-0">
                    <div className={`flex items-center gap-3 ${!isMobile && !isDesktopOpen && 'lg:justify-center'}`}>
                        <div className="relative shrink-0">

                            {
                                data && <div>
                                    {
                                        data.photo ? <Image src={data.photo} alt='' />
                                            :
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold ring-2 ring-violet-500/20">
                                                {data?.username[0].toUpperCase()}
                                            </div>
                                    }
                                </div>
                            }

                            {
                                !data && <div className='flex items-center gap-3'>
                                    <Link href={'/sign-in'}> <CircleUser size={50} /></Link>
                                    <span className='font-bold text-lg'>Hi Login</span>
                                </div>
                            }

                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                        </div>
                        {/* {(isMobile || isDesktopOpen) && (
                            <div className="flex-1 min-w-0">

                                {
                                    data?.email ? <div></div> : 
                                }
                                <p className="text-sm font-semibold text-white truncate">
                                    {data ? `${data.username}`: `Hi user`}
                                </p>
                                <p className="text-xs text-zinc-500 truncate">john@nexus.app</p>
                            </div>
                        )} */}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Top Bar */}
                <div className="h-16 bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-300"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold text-white">{activeLink?.charAt(0).toUpperCase() + activeLink?.slice(1).toLowerCase()} Overview</h2>
                            <p className="text-xs sm:text-sm text-zinc-400 hidden sm:block">Welcome back,  {data?.username ?? "Hello Friends"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-300">
                            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-300">
                            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                {children}
            </main>
        </div>
    );
};