import React from "react"
import Header from "../components/header"
import Lolly from "../components/Lolly"


export default function ShowLolly({ pageContext, location }) {
    console.log("Page Context", JSON.stringify(pageContext))
    const showLollyData = pageContext
    console.log(showLollyData)
    const origin = location.origin

    console.log(location.origin)

    return (
        <div>
            <Header />

            <div className="showLollyDiv" >
                <Lolly fillLollyTop={showLollyData.flavourTop} fillLollyMiddle={showLollyData.flavourMedium} fillLollyBottom={showLollyData.flavourBottom} />
                <div className="info" >
                    <p className="share" >Your Lolly is freezing. Share it with this link:</p>
                    <pre>{`${origin}/${showLollyData.lollyPath}`}</pre>
                    <br />
                    <div className="details" >

                        <p className="recipient" >{showLollyData.recipientName}</p>
                        <div className="message" >{showLollyData.message}</div>
                        <p className="from" >{showLollyData.sender}</p>

                    </div>

                </div>


            </div>

        </div>
    )

}
