import { checkStatus, fetcher, HTTPError } from "../dist";

import fetchMock from "jest-fetch-mock";

describe("throws an error when the response is not ok", () => {
  describe("HTTPError", () => {
    it("extends an Error", () => {
      let notFoundResponse = new Response("", {
        statusText: "Not Found",
        status: 404,
      });

      let error = new HTTPError(notFoundResponse);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual("Not Found");
      expect(error.name).toEqual("HTTPError");
      expect(error.status).toEqual(404);
      expect(error.response).toEqual(notFoundResponse);

      let internalError = new Response("", {
        status: 500,
      });

      let error2 = new HTTPError(internalError);
      expect(error2).toBeInstanceOf(Error);
      expect(error2.message).toEqual("Internal Server Error");
      expect(error2.name).toEqual("HTTPError");
      expect(error2.status).toEqual(500);
      expect(error2.response).toEqual(internalError);
    });
  });

  describe("checkStatus", () => {
    it("throws an error when the response is not ok", async () => {
      let errorResponse = new Response("", {
        status: 404,
        statusText: "Not Found",
      });

      let error = checkStatus(errorResponse);

      expect(error).rejects.toThrow();
      expect(error).rejects.toBeInstanceOf(Error);
      expect(error).rejects.toMatchInlineSnapshot(`[HTTPError: Not Found]`);
    });
  });

  describe("fetcher", () => {
    beforeAll(() => {
      globalThis.fetch = fetchMock as any;
      fetchMock.doMock();
    });

    afterAll(() => {
      globalThis.fetch = undefined as any;
      fetchMock.resetMocks();
    });

    it("throws an error when the response is not ok", () => {
      fetchMock.mockResponseOnce(JSON.stringify({ message: "Not Found" }), {
        url: "http://localhost:3000",
        status: 404,
        statusText: "Not Found",
        headers: {
          "Content-Type": "application/json",
        },
      });

      expect(async () => {
        let res = await fetcher<{ message: string }>("http://localhost:3000");
        expect(res.message).toEqual("Not Found");
      });

      fetcher("http://localhost:3000").catch(async (error: HTTPError) => {
        expect(error).toBeInstanceOf(HTTPError);
        expect(await error.response.json()).toEqual({ message: "Not Found" });
        expect(error.status).toEqual(404);
      });
    });
  });
});
