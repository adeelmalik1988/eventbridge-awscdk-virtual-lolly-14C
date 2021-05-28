import React, { useEffect, useState } from "react"
import { Router } from "@reach/router"
import ShowLolly from "../templates/showLolly"
import { getLollyById } from '../graphql/queries'
import { API } from "aws-amplify"
import { GetLollyByIdQuery } from "../API"

type lollyByIdType = {
    data: GetLollyByIdQuery
}


export default function Lolly({ location }) {

    console.log(location)
    const path = location.pathname.replace("/lolly/", "")
    //const path = '066leqyF'

    console.log(path)

    const [lollyById, setLollyById] = useState<lollyByIdType | null>()


  
    useEffect(() => {
        fetchingLollyById()

    }, [])

    const fetchingLollyById = async () => {
        try {

            const data = await API.graphql({
                query: getLollyById,
                variables: {
                    lollyId: path
                }
            })
            setLollyById(data as lollyByIdType)
            console.log(lollyById)

            //setLollyById(data as lollyByIdType)

            console.log(data)
        } catch (err) {
            console.log(err)
        }
    }





    return (
        <div> 
            <Router basepath="/lolly">
                        <ShowLolly pageContext={lollyById?.data.getLollyById} path={`${lollyById?.data.getLollyById?.lollyPath}`} />

                

            </Router>



        </div>



    )
}
