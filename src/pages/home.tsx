// This page is an exemple of page with error boundary système and components architecture
// Architecture structre design pattern : https://blog-ux.com/quest-ce-que-latomic-design/

import { useAllChannels } from "@api/community.queries";
import { ChannelsList } from "@src/organisms/channelsList";
import { LogoutButton } from "@src/organisms/logoutButton";
import { useState } from "react";

export const HomePage = () => {

    useAllChannels({ refetchOnMount: false, withNotifications: true, enabled: true })

    const fakeData = [
        {
            id: 1,
            name: "test 1",
            sub_id: 2
        },
        {
            id: 2,
            name: "test 2",
            sub_id: 3
        },
        {
            id: 3,
            name: "test 3",
            sub_id: 4
        }
    ]

    const [counter, setCounter] = useState(0);

    const handleClick = () => {
        setCounter(count => count + 1);
    };

    if (counter === 5) {
        throw new Error("Je crash quand le compteur atteint 5!");
    }

    return (
        <div className="w-full">
            <p className="mb-4">Compte actuel : {counter}</p>
            <p className="mb-2 text-sm text-gray-600">
                (Le composant va crasher à 5)
            </p>
            <button
                onClick={handleClick}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Augmenter
            </button>

            <hr className="w-full my-5 border-black" />

            <ChannelsList data={fakeData} />

            <LogoutButton />
        </div>
    );
}