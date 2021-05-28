import { navigate } from "gatsby"
import React, { useRef, useState } from "react"
import Header from "../components/header"
import Lolly from "../components/Lolly"
import { API } from "aws-amplify"
import { createLolly } from "../graphql/mutations"
import { nanoid } from "nanoid"



export default function CreateNew() {
    const [color1, setColor1] = useState<string>("#d52358")
    const [color2, setColor2] = useState<string>("#e95946")
    const [color3, setColor3] = useState<string>("#deaa43")
    const recipientNameRef = useRef<any>('')
    const messageRef = useRef<any>('')
    const senderRef = useRef<any>('')
    //const { loading, error, data } = useQuery(GETDATA)
    // const [createLolly] = useMutation(CREATELOLLYMUTATION)
    //!loading && console.log(data)

    
    
    const submitLollyForm = async () => {
        console.log("clicked")
        console.log("color 1 :", color1)
        console.log("color 2 :", color2)
        console.log("color 3 :", color3)
        console.log("recipientName :", recipientNameRef.current.value)
        console.log("message :", messageRef.current.value)
        console.log("sender", senderRef.current.value)
        const lollyId = nanoid(8)
        console.log(lollyId)




        // await createLolly({
        //     variables: {
        //         recipientName: recipientNameRef.current.value,
        //         message: messageRef.current.value,
        //         sender: senderRef.current.value,
        //         flavourTop: color1,
        //         flavourMedium: color2,
        //         flavourBottom: color3,

        //     }
        // }).then(result => {
        //     navigate(`/${result.data.createLolly.lollyPath}`)

        //     console.log(result)
        // })

        // console.log(result.data.createLolly.lollPath)
        const newLolly = {
            id: lollyId,
            recipientName: recipientNameRef.current.value,
            message: messageRef.current.value,
            sender: senderRef.current.value,
            flavourTop: color1,
            flavourMedium: color2,
            flavourBottom: color3,
            lollyPath: lollyId
        }
        try {

            
            const result = await API.graphql({
                query: createLolly,
                variables: {
                    lolly: newLolly
                }
            })

            console.log(result)
            await navigate(`/${result.data.createLolly.lollyPath}`)

            
        } catch(err){
            console.log(err)

        }


    }


    return (
        <div className="container" >

            {
                // !loading && !error && <div>{JSON.stringify(data.getLolly)}</div>
            }
            <Header />

            <div className="lollyFormDiv" >

                <div>
                    <Lolly fillLollyTop={color1} fillLollyMiddle={color2} fillLollyBottom={color3} />

                </div>
                <div className="lollyFlavourDiv" >

                    <label htmlFor="flavourTop" className="colorPickerLabel" >

                        <input type="color" value={color1} className="colorPicker" name="flavourTop" id="flavourTop"
                            onChange={(e) => {
                                setColor1(e.target.value)
                            }}
                        />
                    </label>
                    <label htmlFor="flavourMiddle" className="colorPickerLabel" >
                        <input type="color" value={color2} className="colorPicker" name="flavourMiddle" id="flavourMiddle"
                            onChange={(e) => {
                                setColor2(e.target.value)
                            }}
                        />

                    </label>
                    <label htmlFor="flavourBottom" className="colorPickerLabel">
                        <input type="color" value={color3} className="colorPicker" name="flavourBottom" id="flavourBottom"
                            onChange={(e) => {
                                setColor3(e.target.value)
                            }}
                        />

                    </label>

                </div>
                <div className="lollyForm" >
                    <label htmlFor="recipientName"  >
                        To
                    </label>
                    <input type="text" name="recipientName" id="recipientName" ref={recipientNameRef} />
                    <label htmlFor="message"  >
                        Message
                    </label>
                    <textarea rows="15" column="30" ref={messageRef} />
                    <label htmlFor="sender"  >
                        From
                    </label>
                    <input type="text" name="sender" id="sender" ref={senderRef} />
                    <br />
                    <button onClick={()=>{submitLollyForm()}}>Freeze this Lolly and get a Link</button>
                </div>

            </div>


        </div>

    )

}