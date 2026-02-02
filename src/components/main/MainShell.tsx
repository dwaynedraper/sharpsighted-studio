import { MainNav } from './MainNav';
import { AdminControlPanel } from '@/components/admin/AdminControlPanel';

interface MainShellProps {
    children: React.ReactNode;
}

export function MainShell({ children }: MainShellProps) {
    return (
        <>
            <MainNav />
            <AdminControlPanel />
            <main>{children}</main>
        </>
    );
}
