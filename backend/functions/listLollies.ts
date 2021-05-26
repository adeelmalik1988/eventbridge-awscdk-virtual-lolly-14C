import * as AWS from "aws-sdk"

const docClient = new AWS.DynamoDB.DocumentClient();

const listLollies = async () => {

    const params = {

        TableName: process.env.TABLE_NAME || "",
    }

    try {
        const result = await docClient.scan(params).promise()
        return result.Items;

    } catch (err) {
        console.log("Dynamo DB Error: ", err)
        return null;
    }

}

export default listLollies