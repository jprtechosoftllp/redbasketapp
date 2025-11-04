"use client"
import React, { useEffect, useState } from 'react'
import { LayoutDashboard, Settings, Users, FileText, BarChart3, Bell, HelpCircle, Folder, Sparkles } from 'lucide-react';
import useAdmin from '../../hooks/useAdmin';
import SidebarComponent from '@meato/packages/frontend/ui/components/Sidebar';



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

const navLinks: NavLink[] = [
    {
        name: 'Dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
        badge: '3',
        subLinks: [
            { name: 'Analytics', href: '/', icon: <BarChart3 className="w-4 h-4" /> },
            { name: 'Reports', href: '#', icon: <FileText className="w-4 h-4" /> },
            { name: 'Notifications', href: '#', icon: <Bell className="w-4 h-4" /> },
            { name: 'Insights', href: '#', icon: <Sparkles className="w-4 h-4" /> },
        ],
    },
    {
        name: 'Managers',
        icon: <Folder className="w-5 h-5" />,
        subLinks: [
            { name: 'Managers Active', href: '/manager/active-managers' },
            { name: 'Managers Archived', href: '/manager/archived-managers' },
            { name: 'Create Manager', href: '/manager/create-manager' },
            // { name: 'Archived', href: '#' },
        ],
    },
    {
        name: 'Vandors',
        icon: <Folder className="w-5 h-5" />,
        subLinks: [
            { name: 'Vendors Active', href: '/vendor/active' },
            { name: 'Vendors Pending', href: '/vendor/pending' },
            { name: 'Vendors Rejected', href: '/vendor/rejected'},
            { name: 'Vendor Create', href: '/vendor/create-vendor'}
            // { name: 'Recent', href: '#' },
            // { name: 'Archived', href: '#' },
        ],
    },
     {
        name: 'Products',
        icon: <Folder className="w-5 h-5" />,
        subLinks: [
            // { name: 'Vendors Active', href: '/product/active' },
            // { name: 'Vendors Pending', href: '/product/pending' },
            { name: 'Product List', href: '/product/product-list'},
            { name: 'Product Create', href: '/product/create-product'},
        ],
    },
    {
        name: 'Category',
        icon: <Users className="w-5 h-5" />,
        badge: '2',
        subLinks: [
            { name: 'Category List', href: '/category/category-list' },
            { name: 'Create Category', href: '/category/create-category' },
        ],
    },
    {
        name: 'Sub Category',
        icon: <Users className="w-5 h-5" />,
        badge: '2',
        subLinks: [
            { name: 'Sub-category List', href: '/sub-category/sub-category-list' },
            { name: 'Create Sub Category', href: '/sub-category/create-sub-category' },
        ],
    },
    {
        name: 'Users',
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
        icon: <HelpCircle className="w-5 h-5" />,
    },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [client, setClient] = useState(false);
    const { admin } = useAdmin();

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
            data={admin}

        >{children}</SidebarComponent>

    )
}