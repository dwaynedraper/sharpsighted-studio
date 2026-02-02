import { RosNav } from './RosNav';
import { MainSiteBadge } from './MainSiteBadge';
import { AdminControlPanel } from '@/components/admin/AdminControlPanel';

interface RosShellProps {
    children: React.ReactNode;
}

export function RosShell({ children }: RosShellProps) {
    return (
        <>
            <RosNav />
            <AdminControlPanel />
            <MainSiteBadge />
            <main>{children}</main>
        </>
    );
}
