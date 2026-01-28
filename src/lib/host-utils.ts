import { headers } from 'next/headers';

export async function getIsRosHost(): Promise<boolean> {
    const headersList = await headers();
    const host = headersList.get('host') || '';
    return host.startsWith('ros.');
}
