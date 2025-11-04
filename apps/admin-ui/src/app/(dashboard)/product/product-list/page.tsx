import { ChevronRight } from 'lucide-react'
import Link from 'next/link';

export default function page() {

    return (
        <div>
            {/* Breadcrumbs */}
            <div className="flex items-center">
                <Link href={'/'} className="text-muted-foreground cursor-pointer hover:text-blue-700">Dashboard</Link>
                <ChevronRight size={20} className='opacity-[.8]' />
                <span className="text-muted-foreground">Products</span>
                <ChevronRight size={20} className='opacity-[.8]' />
                <span> Sub Category</span>
            </div>
        </div>
    )
}