# Strapi Upload Provider - S3 Plus

A simple upload provider using aws-s3 allowing you to specify the `ACL` and base path (`folder`) on any aws-s3 compatible S3 service.
This is very similar to how strapi-provider-upload-aws-s3 works but makes setting `ACL` and a base `folder` easier.


## Installation

Using NPM
```
npm install --save strapi-provider-upload-s3-plus
```

Using Yarn
```
yarn add strapi-provider-upload-s3-plus
```

## Setup

Enable the provider using Strapi's plugin config `config/plugins.js`

```javascript
module.exports = ({env}) => ({
    upload: {
        provider: "s3-plus"
    }
})
```

## Configuration

Configure the provider in Strapi's plugin config `config/plugins.js`

By default the `apiVersion` is "2006-03-01", you can change this using the `apiVersion` property in `providerOptions`. 

The provider configuration defined in `providerOptions` is passed directly to the aws-sdk, [see the full configuration options](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property).


```javascript
module.exports = ({env}) => ({
    upload: {
        provider: "s3-plus",
        providerOptions: {
            // AWS-SDK S3 provider options
        }
    }
})
```
e.g.
```javascript
module.exports = ({env}) => ({
    upload: {
        provider: "s3-plus",
        providerOptions: {
            accessKeyId: 'abcdefghijklmnopqrstuvwxyz123',
            secretAccessKey: 'abcdefghijklmnopqrstuvwxyz123',
            region: 'us-east-1',
            params: {
                Bucket: 'mybucket',
                ACL: 'public-read',
                folder: 'myapp/images',
            }
        }
    }
})
```

It's recommended to use environment variables from the host for sensitive configuration details and
map the environment variables to the plugin configuration:

Example `config/plugins.js` using host environment variables:
```javascript
module.exports = ({env}) => ({
    upload: {
        provider: "s3-plus",
        providerOptions: {
            accessKeyId: env('AWS_ACCESS_KEY_ID'),
            secretAccessKey: env('AWS_ACCESS_SECRET'),
            region: env('AWS_REGION'),
            params: {
                Bucket: env('AWS_BUCKET'),
                ACL: env('AWS_ACL'),
                folder: env('AWS_FOLDER'),
            }
        }
    }
})
```


### Other S3 providers

There is plenty of documentation on configuring aws-sdk S3 for AWS S3 Services, 
below is an example using DigitalOcean Spaces. Configure the `endpoint` property
directly. 


Example Digital Ocean Spaces configuration:

`config/plugin.js`:
```javascript
module.exports = ({env}) => ({
    upload: {
        provider: "s3-plus",
        providerOptions: {
            accessKeyId: env('AWS_ACCESS_KEY_ID'),
            secretAccessKey: env('AWS_ACCESS_SECRET'),
            endpoint: env('AWS_ENDPOINT'),
            params: {
                Bucket: env('AWS_BUCKET'),
                ACL: env('AWS_ACL'),
                folder: env('AWS_FOLDER'),
            }
        }
    }
})
```
`Host environment variables`:
```dotenv
AWS_ACCESS_KEY_ID=abcdefghijklmnopqrstuvwxyz123
AWS_ACCESS_SECRET=abcdefghijklmnopqrstuvwxyz123
AWS_ENDPOINT=https://sgp1.digitaloceanspaces.com
AWS_BUCKET=mybucket
AWS_ACL=public-read
AWS_FOLDER=myfolder/uploads
```


Example using [localstack](https://github.com/localstack/localstack) aws simulated services.

`config/plugin.js`:
```javascript
module.exports = ({env}) => ({
    upload: {
        provider: "s3-plus",
        providerOptions: {
            accessKeyId: '1234567890',
            secretAccessKey: 'abcdefghijklmnopqrstuvwxyz123',
            endpoint: 'http://region.localstack:4572',
            region: 'region',
            params: {
                Bucket: 'bucket',
                ACL: 'public-read',
                folder: 'strapi/uploads',
            },
            s3ForcePathStyle: true, //needed for localstack s3 to work correctly
        }
    }
})
```
