import { navigate } from "gatsby"
import React from "react"

export default function Header() {
    return (
        <div >
            
            <h1 onClick= {()=>navigate("/")} >
                virutal lollipop
            </h1>
                
            <p className="subtitle" > because we all know someone who deserves some sugar</p>


        </div>

    )

}
