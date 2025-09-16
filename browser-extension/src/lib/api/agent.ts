import { Axios } from "axios";
import { IChatSchema } from "../validator/chat.schema";

export class Agent {
  constructor(private readonly api: Axios) {}

  async startChat(Input: IChatSchema): Promise<any> {
    const response = await this.api.post("/sessions", Input);
    return { response };
  }
}
