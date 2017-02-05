require('dotenv').config();
const speech = require('bingspeech-api-client').BingSpeechClient;
const randomatic = require('randomatic');
const file = require("fs");
const azure = require('azure-storage');


const storageAccountName = process.env.STORAGE_NAME;
const storageAccountKey = process.env.STORAGE_KEY;
const containerName = 'audiofiles';

module.exports.getAudio = function (text) {
    console.log('getting audio for ' + text);
    let client = new speech(process.env.BING_SPEECH_API_KEY);
    return client.synthesize(text, "en-au", "female").then(res => {
        var promise = new Promise((resolve, reject) => {
            var waveStream = res.wave;
            var filename = randomatic('Aa0', 8) + '.wav';
            file.writeFileSync(`./temp/${filename}`, waveStream);
            var retryOperations = new azure.ExponentialRetryPolicyFilter();
            var blobSvc = azure.createBlobService(storageAccountName, storageAccountKey).withFilter(retryOperations);
            blobSvc.createContainerIfNotExists(containerName, {
                publicAccessLevel: 'blob'
            }, function (error, result, response) {
                if (!error) {
                    blobSvc.createBlockBlobFromLocalFile(containerName, filename, `./temp/${filename}`, error => {
                        if (error) {
                            reject(error);
                        } else {
                            var  startDate  =  new  Date();
                            var  expiryDate  =  new  Date(startDate);
                            expiryDate.setMinutes(startDate.getMinutes()  +  100);
                            startDate.setMinutes(startDate.getMinutes()  -  100);

                            var  sharedAccessPolicy  =  {
                                  AccessPolicy:  {
                                        Permissions:  azure.BlobUtilities.SharedAccessPermissions.READ,
                                        Start:  startDate,
                                        Expiry:  expiryDate
                                  },
                            };

                            var  token  = blobSvc.generateSharedAccessSignature(containerName, filename,  sharedAccessPolicy);
                            var  sasUrl  = blobSvc.getUrl(containerName, filename,  token);
                            resolve(sasUrl);
                        }
                    });

                } else {
                    reject(error);
                }
            });
        });

        return promise;

    });
}