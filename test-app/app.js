const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');

const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });
const lambdaClient = new LambdaClient({ region: 'us-east-1' });

exports.handler = async (event) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            id: { S: 'unique-id' },
            data: { S: 'Some data to persist' }
        }
    };

    try {
        await dynamoDBClient.send(new PutItemCommand(params));

        const lambdaParams = {
            FunctionName: 'YourLambdaFunctionName', // Change to your Lambda function's name
            InvocationType: 'Event',
            Payload: JSON.stringify({ message: 'Data persisted to DynamoDB' })
        };

        await lambdaClient.send(new InvokeCommand(lambdaParams));

        return {
            statusCode: 200,
            body: JSON.stringify('Data persisted and Lambda invoked'),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify('Error persisting data'),
        };
    }
};
