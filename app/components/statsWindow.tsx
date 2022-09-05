import { StatsData } from "~/types/StatsData";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

type StatsWindowProps = {
    sidebarData: StatsData[],
    activeTravelType: string,
    setActiveTravelType: React.Dispatch<React.SetStateAction<string>>,
}



export default function StatsWindow(props: StatsWindowProps) {
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

    const parseDistance = (distanceMeters: number | undefined, rank: (number | undefined)) => {
        if (distanceMeters == undefined || distanceMeters == 0) {
            return getColors('- km', undefined);
        } else if (distanceMeters < 1000) {
            return getColors(distanceMeters.toFixed(0) + ' m', rank);
        } else {
            return getColors((distanceMeters / 1000).toFixed(1) + ' km', rank);
        }
    }

    const parseDuration = (durationSeconds: number | undefined, rank: (number | undefined)) => {
        if (durationSeconds == undefined || durationSeconds == 0) {
            return getColors('- min', undefined);
        } else if (durationSeconds <= 60) {
            return getColors(1 + ' min', rank);
        } else if (durationSeconds < 3600) {
            return getColors((durationSeconds / 60).toFixed(0) + ' min', rank);
        } else {
            return getColors((durationSeconds / 3600).toFixed(0) + ' h ' + ((durationSeconds % 3600) / 60).toFixed(0) + ' min', rank);
        }
    }

    const parseCarbon = (carbonGrams: number | undefined, rank: (number | undefined)) => {
        if (carbonGrams == undefined || carbonGrams == 0) {
            return getColors("- kg", undefined); 
        } else if (carbonGrams < 10) {
            return getColors("Negligible", rank);
        } else {
            return getColors((carbonGrams / 1000).toPrecision(3) + ' kg', rank);
        }
    }

    const getColors = (text: string, rank: (number | undefined)) => {
        switch (rank) {
            case 0:
                return <span className="text-green-500">{text}</span>;
            case 1:
                return <span className="text-yellow-500">{text}</span>;
            case 2:
                return <span className="text-orange-500">{text}</span>;
            case 3:
                return <span className="text-red-500">{text}</span>;
            default:
                return <span className="text-gray-400">{text}</span>;
        }
    }

    return (
        <div className={classNames(
            'rounded-xl bg-gray-200 p-4',
            'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
        )}>
                <table className="table-fixed mt-1 space-x-1 text-base lg:text-lg xl:text-xl font-normal leading-4 text-gray-500 text-center">
                    <thead className="text-sm md:text-md lg:text-lg xl:text-xl font-medium leading-5 text-black font-['Alata']">
                        <tr>
                            <th className="pl-1 pr-2 whitespace-nowrap">Transit Type</th>
                            <th className="px-3 md:px-4 xl:px-5">Distance</th>
                            <th className="px-3 md:px-4 xl:px-5">Duration</th>
                            <th className="px-6 md:px-7 xl:px-8">CO<sub>2</sub></th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.sidebarData.sort((a, b) => { 
                                return 0; // TODO: add sorting by clicking on the titles
                            }).map((transport) => (
                                <tr
                                    key={transport.id}
                                    className={classNames(
                                        `${props.activeTravelType === transport.type ? 'outline ring-blue-400 ring-2 z-10' : ''}`,
                                        "relative rounded-md py-4 hover:bg-gray-100 mt-1 space-x-1 font-normal leading-4 text-gray-500 pl-2 pr-3 font-['Maven_Pro']"
                                    )}
                                    onClick={() => props.setActiveTravelType(transport.type)}
                                >
                                    <td className="text-xs md:text-sm lg:text-base xl:text-lg font-medium leading-5 flex text-black items-center font-sans">
                                        <img src={"/images/" + transport.type + ".png"} className="max-h-5 max-w-5"  onError={(event) => (event.target as HTMLInputElement).style.display = 'none'}></img> 
                                        {transport.title}
                                    </td>
                                
                                    <td>{parseDistance(transport.distanceMeters, transport.distanceRank)}</td>

                                    <td>{parseDuration(transport.durationSeconds, transport.durationRank)}</td>

                                    <td>{parseCarbon(transport.carbonGrams, transport.carbonRank)}</td>

                                    <td>
                                    <a
                                    href="#"
                                    className={classNames(
                                        'absolute inset-0 rounded-md',
                                        'ring-blue-400 focus:z-10 focus:outline-none focus:ring-2'
                                    )}
                                    />
                                    </td>
                                </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    )
}