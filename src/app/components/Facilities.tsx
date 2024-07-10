/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type facilityObject =  {
    facility_id:    number
    facility_name:  string
    facility_cost:  number
    facility_time:  number
}

export function Facilities () {
    const serverUrl = 'http://localhost:8080/'
    const [facility, setFacility] = useState([])
    const router = useRouter()

    const pushToSlots = (id: number) => {
        router.push(`${window.location.origin}/reservation/${id}`)
    }

    useEffect(() => {        
        axios.get(`${serverUrl}facility`).then((response) => { setFacility(response.data) })      
    }, [])

    return (
        <div className="flex flex-col gap-20 text-center items-center">
            <div className="text-9xl text-wrap">
                Rural Company
            </div>
            <div className="flex gap-4">
                {facility.length === 0 ? "Loading Facilities..." :
                    facility.map((element: facilityObject) => {
                        return (
                            <div className="flex flex-col border-2 border-black
                            rounded-xl p-2 hover:cursor-pointer hover:bg-slate-200"
                            key={element.facility_id} onClick={() => pushToSlots(element.facility_id)}>
                                <div className="text-2xl">{element.facility_name}</div>
                                <div>Cost/slot: Rs {element.facility_cost}</div>
                                <div>Hours/slot: {element.facility_time}</div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}