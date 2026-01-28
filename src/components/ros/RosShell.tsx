import { RosNav } from './RosNav';

interface RosShellProps {
    children: React.ReactNode;
}

export function RosShell({ children }: RosShellProps) {
    return (
        <>
            <RosNav />
            <main>{children}</main>
        </>
    );
}
