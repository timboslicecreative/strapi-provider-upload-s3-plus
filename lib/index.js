'use strict';

/* eslint-disable no-unused-vars */
const AWS = require('aws-sdk');

module.exports = {
    init(config) {
        // console.debug('strapi-provider-upload-s3-plus:init', 'config:', config);

        const {ACL = 'public-read', folder = null} = config.params;

        const isPublic = acl => acl.indexOf('public') > -1;
        const slash = str => str ? str+'/' : '';
        const makeKey = file => `${slash(folder)}${slash(file.path)}${file.hash}${file.ext}`;

        const S3 = new AWS.S3({
            apiVersion: '2006-03-01',
            ...config,
        });

        return {
            upload(file, customParams = {}) {
                return new Promise((resolve, reject) => {
                    // console.debug('strapi-provider-upload-s3-plus:init', 'upload:file', file, 'customParams:', customParams);
                    S3.upload({
                            Key: makeKey(file),
                            Body: Buffer.from(file.buffer, 'binary'),
                            ContentType: file.mime,
                            ACL: ACL,
                            ...customParams,
                        },
                        (err, data) => {
                            // console.debug('strapi-provider-upload-s3-plus:init', 'S3.upload:data', data);
                            if (err) return reject(err);
                            // set the bucket file url
                            file.url = isPublic(ACL) ? data.Location : S3.getSignedUrl('getObject', {
                                Bucket: data.bucket,
                                Key: data.key,
                                Expires: 0
                            });
                            resolve();
                        }
                    );
                });
            },
            delete(file, customParams = {}) {
                return new Promise((resolve, reject) => {
                    S3.deleteObject({
                            Key: makeKey(file),
                            ...customParams,
                        },
                        (err, data) => {
                            if (err) return reject(err);
                            resolve();
                        }
                    );
                });
            },
        };
    },


};
