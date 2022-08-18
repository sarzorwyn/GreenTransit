import { Tab } from "@headlessui/react/dist/components/tabs/tabs";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { NameValue } from "~/types/types";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export async function loader() {
    return {
        Fastest: [
          {
            id: 1,
            title: 'Driving',
            type: 'driving-traffic',
            distance: '',
            duration: '',
            shareCount: 2,
          },
          {
            id: 2,
            title: 'Cycling',
            type: 'cycling',
            distance: '',
            duration: '',
            shareCount: 2,
          },
          {
            id: 3,
            title: 'Walking',
            type: 'walking',
            distance: '',
            duration: '',
            shareCount: 2,
          },
        ],
    }
}

export default function Sidebar(distances: NameValue, duration: NameValue) {
    const [categories, setCategories] = useState({Fastest: [
        {
          id: 1,
          title: 'Driving',
          type: 'driving-traffic',
          distance: '',
          duration: '',
          shareCount: 2,
        },
        {
          id: 2,
          title: 'Cycling',
          type: 'cycling',
          distance: '',
          duration: '',
          shareCount: 2,
        },
        {
          id: 3,
          title: 'Walking',
          type: 'walking',
          distance: '',
          duration: '',
          shareCount: 2,
        },
      ],});

    const test = [        {
        id: 1,
        title: 'Driving',
        type: 'driving-traffic',
        distance: '',
        duration: '',
        shareCount: 2,
      },
      {
        id: 2,
        title: 'Cycling',
        type: 'cycling',
        distance: '',
        duration: '',
        shareCount: 2,
      },
      {
        id: 3,
        title: 'Walking',
        type: 'walking',
        distance: '',
        duration: '',
        shareCount: 2,
      },]

    return (
        <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {Object.keys(categories).map((category) => (
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
                {Object.values(categories).map((posts, idx) => (
                    <Tab.Panel
                    key={idx}
                    className={classNames(
                        'rounded-xl bg-white p-3',
                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                    )}
                    >
                    <ul>
                        {test.map((post) => (
                        <li
                            key={post.id}
                            className="relative rounded-md p-3 hover:bg-gray-100"
                        >
                            <h3 className="text-sm font-medium leading-5">
                            {post.title}
                            </h3>

                            <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                            <li>{post.distance}</li>
                            <li>&middot;</li>
                            <li>{post.duration}</li>
                            <li>&middot;</li>
                            {/* <li>{post.shareCount}</li> */}
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