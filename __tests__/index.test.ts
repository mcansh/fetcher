import { checkStatus, fetcher, HTTPError } from "../dist";
import fetch from "node-fetch";
import fetchMock from "jest-fetch-mock";

describe("throws an error when the response is not ok", () => {
  describe("HTTPError", () => {
    it("extends an Error", () => {
      let notFoundResponse = {
        statusText: "Not Found",
        status: 404,
        ok: false,
      };

      let error = new HTTPError(notFoundResponse as Response);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual("Not Found");
      expect(error.name).toEqual("HTTPError");
      expect(error.status).toEqual(404);
      expect(error.response).toEqual(notFoundResponse);

      let unknownError = {
        ok: false,
      };

      let error2 = new HTTPError(unknownError as Response);
      expect(error2).toBeInstanceOf(Error);
      expect(error2.message).toEqual("Unknown response error");
      expect(error2.name).toEqual("HTTPError");
      expect(error2.status).toEqual(undefined);
      expect(error2.response).toEqual(unknownError);

      let errorWithoutStatusCode = {
        ok: false,
        status: 500,
      };

      let error3 = new HTTPError(errorWithoutStatusCode as Response);
      expect(error3).toBeInstanceOf(Error);
      expect(error3.message).toEqual("500");
      expect(error3.name).toEqual("HTTPError");
      expect(error3.status).toEqual(500);
      expect(error3.response).toEqual(errorWithoutStatusCode);
    });
  });

  describe("checkStatus", () => {
    it("throws an error when the response is not ok", async () => {
      let errorResponse = {
        status: 404,
        statusText: "Not Found",
        ok: false,
      };

      let error = checkStatus(errorResponse as Response);

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
