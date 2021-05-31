import * as AWS from "aws-sdk"
import Lolly from "./LollyType"


const docClient = new AWS.DynamoDB.DocumentClient();


function AddEvent(Lolly: Lolly) {
    const eventBridge = new AWS.EventBridge({ region: "us-west-2" })
    console.log("AddEvent function called: the value of result is ", Lolly)
    const eventParms = {
        Entries: [
            {
                EventBusName: "default",
                Source: "lambda-events-codepipelineFE",
                DetailType: "addBookmark",
                Detail: `{ "LollyPath": "${Lolly.lollyPath}","ID": "${Lolly.id}"}`
            },
        ]

    }

    console.log("eventParms :", eventParms)
    return eventBridge.putEvents(eventParms, (err, data) => {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log(data)
        }

    }).promise()
}


const createLolly = async (lolly: Lolly) => {

    const params = {

        TableName: process.env.TABLE_NAME || "",
        Item: lolly

    }

    try {
        await docClient.put(params).promise()
        await AddEvent(lolly)


        return lolly;

    } catch (err) {
        console.log("Dynamo DB Error: ", err)
        return null;
    }

}

export default createLolly