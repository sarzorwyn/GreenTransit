import { Tab } from "@headlessui/react";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { NameValue, SidebarData } from "~/types/types";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

type SidebarProps = {
    sidebarData: SidebarData[]
}

export default function Sidebar(props: SidebarProps) {
    const categories = [
        'Fastest',
        'Nicest'
    ];

    const parseDistance = (distance: number | undefined) : string => {
        if (distance == undefined || distance == 0) {
            return ''
        } else if (distance < 1000) {
            return distance.toFixed(0) + ' m';
        } else {
            return (distance / 1000).toFixed(1) + ' km'
        }
    }

    const parseDuration = (duration: number | undefined) : string => {
        if (duration == undefined || duration == 0) {
            return ''
        } else if (duration < 60) {
            return 1 + ' min';
        } else if (duration < 3600) {
            return (duration / 60).toFixed(0) + ' mins'
        } else {
            return (duration / 3600).toFixed(0) + ' h ' + ((duration % 3600) / 60).toFixed(0) + ' mins'
        }
    }

    return (
        <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {categories.map((category) => (
                <Tab
                key={category}
                className={({ selected }) =>
                    classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                        ? 'bg-white shadow'
                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                    )
                }
                >
                {category}
                </Tab>
            ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
                {categories.map((posts, idx) => (
                    <Tab.Panel
                    key={idx}
                    className={classNames(
                        'rounded-xl bg-white p-3',
                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                    )}
                    >
                    <ul>
                        {props.sidebarData.map((transport) => (
                        <li
                            key={transport.id}
                            className="relative rounded-md p-3 hover:bg-gray-100"
                        >
                            <h3 className="text-sm font-medium leading-5">
                            {transport.title}
                            </h3>
                            <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                            <li>{parseDistance(transport.distance)}</li>
                            <li>&middot;</li>
                            <li>{parseDuration(transport.duration)}</li>
                            <li>&middot;</li>
                            <li>{transport.carbon}</li>
                            </ul>

                            <a
                            href="#"
                            className={classNames(
                                'absolute inset-0 rounded-md',
                                'ring-blue-400 focus:z-10 focus:outline-none focus:ring-2'
                            )}
                            />
                        </li>
                        ))}
                    </ul>
                </Tab.Panel>
            ))}
            </Tab.Panels>
        </Tab.Group>
    )
}