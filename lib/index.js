'use strict';

const AWS = require('aws-sdk');

module.exports = {
    init(config) {
        const {params: {ACL = 'public-read', folder = null, hostPrefix = null,}} = config;
        const isPublic = acl => acl.indexOf('public') > -1;
        const slash = str => str ? str + '/' : '';
        const makeKey = file => `${slash(folder)}${slash(file.path)}${file.hash}${file.ext}`;

        const s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            ...config
        });

        return {
            upload(file, customParams = {}) {
                return new Promise((resolve, reject) => {
                    const Key = makeKey(file)
                    s3.upload({
                            Key,
                            Body: Buffer.from(file.buffer, 'binary'),
                            ContentType: file.mime,
                            ACL: ACL,
                            ...customParams,
                        },
                        (err, data) => {
                            if (err) return reject(err);
                            if (hostPrefix) {
                                file.url = `${hostPrefix}/${Key}`
                            } else {
                                file.url = isPublic(ACL) ? data.Location : s3.getSignedUrl('getObject', {
                                    Bucket: data.bucket,
                                    Key: data.key,
                                    Expires: 0
                                });
                            }
                            resolve();
                        }
                    );
                });
            },
            delete(file, customParams = {}) {
                return new Promise((resolve, reject) => {
                    s3.deleteObject({
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
