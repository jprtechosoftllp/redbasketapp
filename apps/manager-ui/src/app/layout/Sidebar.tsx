"use client"
import React, { useEffect, useState } from 'react'
import { LayoutDashboard, Settings, Users, FileText, BarChart3, Bell, HelpCircle, Folder, Sparkles } from 'lucide-react';
import useManager from '../../hooks/useManager';
import SidebarComponent from '@meato/packages/frontend/ui/components/Sidebar';



interface SubLink {
    name: string;
    href: string;
    icon?: React.ReactNode;
}

interface NavLink {
    name: string;
    href: string;
    icon: React.ReactNode;
    subLinks?: SubLink[];
    badge?: string;
}

const navLinks: NavLink[] = [
    {
        name: 'Dashboard',
        href: '/',
        icon: <LayoutDashboard className="w-5 h-5" />,
        badge: '3',
        subLinks: [
            { name: 'Analytics', href: '/', icon: <BarChart3 className="w-4 h-4" /> },
            { name: 'Reports', href: '#', icon: <FileText className="w-4 h-4" /> },
            { name: 'Notifications', href: '#', icon: <Bell className="w-4 h-4" /> },
            { name: 'Insights', href: '#', icon: <Sparkles className="w-4 h-4" /> },
        ],
    },
    // {
    //     name: 'Managers',
    //     href: '/managers',
    //     icon: <Folder className="w-5 h-5" />,
    //     subLinks: [
    //         { name: 'Managers List', href: '/managers' },
    //         { name: 'Create Manager', href: '/managers/add' },
    //         // { name: 'Recent', href: '#' },
    //         // { name: 'Archived', href: '#' },
    //     ],
    // },
    {
        name: 'Vandors',
        href: '/vandors',
        icon: <Folder className="w-5 h-5" />,
        subLinks: [
            { name: 'Vandor List', href: '/vendors' },
            { name: 'Create Vandor', href: '/vendors/create-vendor' },
            // { name: 'Recent', href: '#' },
            // { name: 'Archived', href: '#' },
        ],
    },
    {
        name: 'Users',
        href: '#',
        icon: <Users className="w-5 h-5" />,
        badge: '2',
        subLinks: [
            { name: 'All Users', href: '#' },
            { name: 'Add User', href: '#' },
            { name: 'User Groups', href: '#' },
            { name: 'Permissions', href: '#' },
            { name: 'Activity Log', href: '#' },
        ],
    },

    // {
    //     name: 'Documents',
    //     href: '#',
    //     icon: <Folder className="w-5 h-5" />,
    //     subLinks: [
    //         { name: 'My Documents', href: '#' },
    //         { name: 'Shared', href: '#' },
    //         { name: 'Recent', href: '#' },
    //         { name: 'Archived', href: '#' },
    //     ],
    // },
    // {
    //     name: 'Security',
    //     href: '#',
    //     icon: <Shield className="w-5 h-5" />,
    //     badge: 'Pro',
    //     subLinks: [
    //         { name: 'Overview', href: '#' },
    //         { name: 'Access Control', href: '#' },
    //         { name: 'API Keys', href: '#' },
    //         { name: 'Audit Logs', href: '#' },
    //     ],
    // },
    {
        name: 'Settings',
        href: '#',
        icon: <Settings className="w-5 h-5" />,
        subLinks: [
            { name: 'General', href: '#' },
            { name: 'Appearance', href: '#' },
            { name: 'Billing', href: '#' },
            { name: 'Integrations', href: '#' },
            { name: 'Advanced', href: '#' },
        ],
    },
    {
        name: 'Help',
        href: '#',
        icon: <HelpCircle className="w-5 h-5" />,
    },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [client, setClient] = useState(false);
    const { manager } = useManager();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) {
                setIsMobileMenuOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        setClient(true)
    }, [children])
    return (
        client && <SidebarComponent
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            isMobile={isMobile}
            navLinks={navLinks}
            data={manager}

        >{children}</SidebarComponent>

    )
}