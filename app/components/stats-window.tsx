import { Tab } from "@headlessui/react";
import { SidebarData } from "~/types/types";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

type SidebarProps = {
    sidebarData: SidebarData[]
}



export default function StatsWindow(props: SidebarProps) {
    const categories = [
        {
            id: 'Fastest',
            comparator: 'durationSeconds',
        },
        {
            id: 'Least Carbon Footprint',
            comparator: 'carbonGrams'
        }
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
            return '- kg';
        } else if (carbonGrams < 1) {
            return 'Negligible';
        } else {
            return (carbonGrams / 1000).toFixed(3) + ' kg';
        }
    }

    return (
        <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/60 p-1">
            {categories.map((category) => (
                <Tab
                key={category.id}
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
                {category.id}
                </Tab>
            ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
                {categories.map((category, idx) => (
                    <Tab.Panel
                    key={idx}
                    className={classNames(
                        'rounded-xl bg-gray-200 p-3',
                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                    )}
                    >

                    <table className="table-fixed mt-1 space-x-1 text-xs font-normal leading-4 text-gray-500 text-center">
                        <thead className="text-sm font-medium leading-5 text-black font-['Alata']">
                            <tr>
                                <th className="pl-1 pr-2 whitespace-nowrap">Transit Type</th>
                                <th className="pl-1 pr-1">Distance</th>
                                <th className="pl-1 pr-1">Duration</th>
                                <th className="pl-4 pr-4">CO<sub>2</sub></th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.sidebarData.sort((a, b) => { 
                                if (category.comparator === 'durationSeconds') {
                                    return a.durationSeconds - b.durationSeconds
                                } else if (category.comparator === 'carbonGrams') {
                                    return a.carbonGrams - b.carbonGrams
                                } else {
                                    return 0; // in place
                                }
                                }).map((transport) => (
                                    <tr
                                        key={transport.id}
                                        className="relative rounded-md p-4 hover:bg-gray-100 mt-1 space-x-1 text-xs font-normal leading-4 text-gray-500 pl-2 pr-3"
                                    >
                                        <h3 className="text-sm font-medium leading-5 flex text-black items-center">
                                            <img src={"/images/" + transport.type + ".png"} className="max-h-5 max-w-5"></img>
                                            {transport.title}
                                        </h3>
                                    
                                        <td>{parseDistance(transport.distanceMeters)}</td>

                                        <td>{parseDuration(transport.durationSeconds)}</td>

                                        <td>{parseCarbon(transport.carbonGrams)}</td>

                                        <a
                                        href="#"
                                        className={classNames(
                                            'absolute inset-0 rounded-md',
                                            'ring-blue-400 focus:z-10 focus:outline-none focus:ring-2'
                                        )}
                                        />
                                    </tr>
                            ))}
                        </tbody>
                    </table>
                </Tab.Panel>
            ))}
            </Tab.Panels>
        </Tab.Group>
    )
}