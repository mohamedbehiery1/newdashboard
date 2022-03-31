import { last, split, startsWith } from 'lodash';

export const extractBase64ImageData = (base64String) => {
    const base64ImageData = last(split(base64String, ','));
    return base64ImageData;
};

export const isValidBase64ImageString = (base64String) => {
    return startsWith(base64String, 'data:image');
};

export const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}
