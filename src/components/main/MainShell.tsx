import { MainNav } from './MainNav';

interface MainShellProps {
    children: React.ReactNode;
}

export function MainShell({ children }: MainShellProps) {
    return (
        <>
            <MainNav />
            <main>{children}</main>
        </>
    );
}
