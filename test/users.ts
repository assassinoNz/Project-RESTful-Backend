import { client, handleError } from "./util.js";

export class Users {
    static getMany() {
        client.get("/users", {
            queries: { pageSize: 10, page: 0 },
        }).then(res => console.log(res))
            .catch(handleError);
    }

    static createOne() {
        client.post("/users", {
            data: {
                mobile: "0712345678",
                roleId: 1,
                status: "ACTIVE"
            },
        }).then(res => console.log(res))
            .catch(handleError);
    }

    static getOne() {
        client.get("/users/:id", {
            params: { id: 1 }
        }).then(res => console.log(res))
            .catch(handleError);
    }

    static updateOne() {
        client.put("/users/:id", {
            data: {
                mobile: "0712345678",
                roleId: 1,
                status: "ACTIVE"
            }
        }, {
            params: { id: 1 }
        }).then(res => console.log(res))
            .catch(handleError);
    }
}