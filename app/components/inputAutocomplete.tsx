import { Combobox } from "@headlessui/react";
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
            <div className="relative cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                <Combobox.Input 
                    className="shadow appearance-none border rounded py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={props.placeholder}
                    autoComplete={"off"}
                    onChange={(event) => props.dispatch({type: locationActions.updateQuery, payload: event.target.value})} />
                <Combobox.Options>
                    {props.locationState.suggestions.map((place: any) => (
                        <Combobox.Option 
                            className="shadow appearance-none border rounded overflow-hidden max-w-xs py-1 px-2 text-gray-600 bg-slate-700 leading-tight focus:outline-none focus:shadow-outline"   
                            key={place.text} 
                            value={place.text}>
                        {place.text}
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </div>
        </Combobox>
    )
}