import React from "react"
import { navigate } from "gatsby"

const isBrower = typeof window !== "undefined"  // Check if window is defined (so if in the browser or in node.js).

const NotFoundPage = ({location}) => {

   // const navigate =  useNavigate()
    if(isBrower){

        if(location.pathname!=="/"){
            console.log("Site Origin :",location.origin)
            // const navigateftn = async() => {
                
                //await 
                navigate(`/lolly${location.pathname}`)
                // }
                
                // navigateftn()
                
                
            }
        }

    // if(typeof window !== "undefined" ){


    //     window.location.reload()
    // }


    return(
        <div>
            Let us get you lolly....
        </div>
    )
}
export default NotFoundPage