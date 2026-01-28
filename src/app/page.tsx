import { getIsRosHost } from '@/lib/host-utils';
import { MainHomePage } from '@/components/main/MainHomePage';
import { RosHomePage } from '@/components/ros/RosHomePage';

export default async function HomePage() {
    const isRosHost = await getIsRosHost();

    return isRosHost ? <RosHomePage /> : <MainHomePage />;
}
