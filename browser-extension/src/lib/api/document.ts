import { Axios } from "axios";

export class Document{
	constructor(private readonly api: Axios) {}

    async uploadDocument(file: File) {
        const {data}= await this.api.put('/api/documents/upload', file)
        return data;
    }    
}
