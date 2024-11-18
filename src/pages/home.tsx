// This page is an exemple of page with error boundary système and components architecture
// Architecture structre design pattern : https://blog-ux.com/quest-ce-que-latomic-design/

import { useAllChannels } from "@api/community.queries";
import { ChannelsList } from "@src/organisms/channelsList";
import { LogoutButton } from "@src/organisms/logoutButton";

export const HomePage = () => {

    const { data, isError, isLoading } = useAllChannels({ refetchOnMount: false, withNotifications: true, enabled: true })

    return (
        <div className="w-full flex flex-col items-start justify-start gap-4 py-4">
            
            <LogoutButton />
            { !isError && data?.length && <ChannelsList data={data} isLoading={isLoading} /> }

        </div>
    );
}