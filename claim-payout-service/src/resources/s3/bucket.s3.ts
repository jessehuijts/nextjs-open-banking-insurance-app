export const ClaimImageBucket = {
    Type: "AWS::S3::Bucket",
    Properties: {
        BucketName: "claim-image",
        AccessControl: "PublicRead"
    }
}