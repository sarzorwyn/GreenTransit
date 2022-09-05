import { Combobox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { locationActions, LocationState } from "~/types/LocationState";

type InputAutocompleteProps = {
    locationState: LocationState,
    dispatch: React.Dispatch<{
        type: string;
        payload: any;
    }>,
    placeholder: string
}

/**
 * A input box for address, that can be controlled to display address of what the user selects using the map
 * or auto suggest locations for the user to pick from when typing
 * @param props The location data and callbacks to modify data
 * @returns The input box for the address input
 */
export default function InputAutocomplete(props: InputAutocompleteProps) {
    return (
        <Combobox value={props.locationState.input} onChange={input => props.dispatch({type: locationActions.selectInput, payload: input})}>
            <div className="relative mt-1">
                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                    <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 sm:text-sm leading-5 text-gray-900 focus:ring-0 shadow-md"
                    autoComplete="off"
                    placeholder={props.placeholder}
                    // displayValue={(person) => person.name}
                    onChange={(event) => props.dispatch({type: locationActions.updateQuery, payload: event.target.value})}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    {/* <SelectorIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                    /> */}
                    </Combobox.Button>
                </div>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => props.dispatch({type: locationActions.updateQuery, payload: ''})}
                >
                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {props.locationState.suggestions == undefined && props.locationState.query != '' ? 
                    (
                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                        </div>
                    ) : (
                        props.locationState.suggestions?.map((place: any) => (
                        <Combobox.Option
                            key={place.text}
                            className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active ? 'bg-green-600 text-white' : 'text-gray-900'
                            }`
                            }
                            value={place.text}
                        >
                            {place.text}
                        </Combobox.Option>
                        ))
                    )}
                    </Combobox.Options>
                </Transition>
            </div>
        </Combobox>
    )
}