// @ts-nocheck

import fs from "fs"
import path from "path"
import mime from "mime"
import fetch from "node-fetch"
import { URL } from "url"

export default class urlToBase64 {
    constructor(
        public mimetype: string, 
        public data: string, 
        public filename: string, 
        public filesize?: string) {    }

    static fromFilePath(filePath: string) {
        const b64data = fs.readFileSync(filePath, {encoding: 'base64'});
        const mimetype = mime.getType(filePath); 
        const filename = path.basename(filePath);

        return new this(mimetype, b64data, filename);
    }

    static async fromUrl(url: string, options: any = {}) {
        const pUrl = new URL(url);
        let mimetype = mime.getType(pUrl.pathname);

        if (!mimetype && !options.unsafeMime)
            throw new Error('Unable to determine MIME type using URL. Set unsafeMime to true to download it anyway.');

        const res = await this.fetchData(url, options?.reqOptions);

        const filename = options.filename ||
            (res.name ? res.name[0] : (pUrl.pathname.split('/').pop() || 'file'));
        
        if (!mimetype)
            mimetype = res.mime;

        return new this(mimetype, res.data, filename, res.size || null);
    }

    private static async fetchData (url: string, options: any) {
        const reqOptions = Object.assign({ headers: { accept: 'image/* video/* text/* audio/*' } }, options);
        const response = await fetch(url, reqOptions);
        const mime = response.headers.get('Content-Type');
        const size = response.headers.get('Content-Length');

        const contentDisposition = response.headers.get('Content-Disposition');
        const name = contentDisposition ? contentDisposition.match(/((?<=filename=")(.*)(?="))/) : null;

        let data = '';
        if (response.buffer) {
            data = (await response.buffer()).toString('base64');
        } else {
            const bArray = new Uint8Array(await response.arrayBuffer());
            bArray.forEach((b) => {
                data += String.fromCharCode(b);
            });
            data = btoa(data);
        }
        
        return { data, mime, name, size };
    }
}
