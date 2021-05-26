import * as AWS from "aws-sdk"
import Lolly from "./LollyType"

const docClient = new AWS.DynamoDB.DocumentClient();

const createLolly = async (lolly: Lolly) => {

    const params = {

        TableName: process.env.TABLE_NAME || "",
        Item: lolly

    }

    try {
        await docClient.put(params).promise()
        return lolly;

    } catch (err) {
        console.log("Dynamo DB Error: ", err)
        return null;
    }

}

export default createLolly