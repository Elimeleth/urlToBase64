# Convert paths or urls to base64 file

## Usage

```ts
import { UrlBase64 } from "@gogh/url-to-base64"


const { mimetype, data } = await UrlBase64.fromUrl(url)


console.log(mimetype, data)

/*
mimetype is an image/jpg | application/pdf or any mimetype format

data is a base64 raw

data:${mimetype};base64,${data}
*/


// Other way for make the same

// filePath is './image.jpg' or any route in your local file system

const { mimetype, data } = await UrlBase64.fromFilePath(url)


console.log(mimetype, data)
```