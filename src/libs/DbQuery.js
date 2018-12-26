import AWS from "aws-sdk";
AWS.config.update({ region: "us-east-2" });

const dynamoDb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const params = {
  ExpressionAttributeValues: {
    ":s": { N: "2" },
    ":e": { N: "09" },
    ":topic": { S: "PHRASE" }
  },
  KeyConditionExpression: "Season = :s and Episode > :e",
  ProjectionExpression: "Title, Subtitle",
  FilterExpression: "contains (Subtitle, :topic)",
  TableName: "notes"
};

dynamoDb.query(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    data.Items.forEach(function(element, index, array) {
      console.log(element.Title.S + " (" + element.Subtitle.S + ")");
    });
  }
});
