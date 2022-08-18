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

    const parseDistance = (distanceMeters: number | undefined) : string => {
        if (distanceMeters == undefined || distanceMeters == 0) {
            return '- km'
        } else if (distanceMeters < 1000) {
            return distanceMeters.toFixed(0) + ' m';
        } else {
            return (distanceMeters / 1000).toFixed(1) + ' km'
        }
    }

    const parseDuration = (durationSeconds: number | undefined) : string => {
        if (durationSeconds == undefined || durationSeconds == 0) {
            return '- mins'
        } else if (durationSeconds < 60) {
            return 1 + ' min';
        } else if (durationSeconds < 3600) {
            return (durationSeconds / 60).toFixed(0) + ' mins'
        } else {
            return (durationSeconds / 3600).toFixed(0) + ' h ' + ((durationSeconds % 3600) / 60).toFixed(0) + ' mins'
        }
    }

    const parseCarbon = (carbonGrams: number | undefined) : string => {
        if (carbonGrams == undefined || carbonGrams == 0) {
            return '- kg CO2';
        } else if (carbonGrams < 1) {
            return 'Negligible';
        } else {
            return (carbonGrams / 1000).toFixed(3) + ' kg';
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
                            <li>{parseDistance(transport.distanceMeters)}</li>
                            <li>&middot;</li>
                            <li>{parseDuration(transport.durationSeconds)}</li>
                            <li>&middot;</li>
                            <li>{parseCarbon(transport.carbonGrams)}</li>
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