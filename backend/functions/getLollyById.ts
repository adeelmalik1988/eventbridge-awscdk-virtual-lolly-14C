import * as AWS from "aws-sdk"


const docClient = new AWS.DynamoDB.DocumentClient();

const getLollyById = async (lollyId: string) => {

    const params = {

        TableName: process.env.TABLE_NAME || "",
        Key: {
            id: lollyId
        }

    }

    try {
        const data = await docClient.get(params).promise()
        return data.Item;

    } catch (err) {
        console.log("Dynamo DB Error: ", err)
        return null;
    }

}

export default getLollyById