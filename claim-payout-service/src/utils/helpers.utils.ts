import axios from "axios";

export const getFirstKeyOfObject = (object: { [index: string]: any }) => {
    return Object.keys(object)[0]
}

export async function makeDownloadStream(url: string) {
    return axios.get(url, { responseType: "stream" });
}