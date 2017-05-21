var request = require("request"),
    assert = require('assert'),
    base_url = "http://localhost:3000/allRequests";

describe("Doing CRUD operations on mongo", function() {
    describe("GET all requests from specific date", function() {
        it("should return all records on day 18", function(done) {
            request.get(base_url, function(error, response, body) {
                console.log(Object.keys(response)[0]);
                console.log(Object.keys(response)[1]);
                console.log(Object.keys(response)[2]);
                console.log(Object.keys(response)[3]);
                console.log(Object.keys(response)[4]);
                console.log(Object.keys(response)[5]);
                console.log(Object.keys(response)[6]);
                console.log(Object.keys(response)[7]);
                console.log(Object.keys(response)[8]);
                console.log(Object.keys(response)[9]);
                console.log("=====================================");
                console.log(Object.keys(body)[0]);
                console.log(Object.keys(body)[1]);
                console.log(Object.keys(body)[2]);
                console.log(Object.keys(body)[3]);
                console.log(Object.keys(body)[4]);
                console.log(Object.keys(body)[5]);

                //expect(response.statusCode).toBe(200);
                assert.equal(200, response.statusCode);
                assert.equal(200, response.statusCode);
                done();
            });
        });



        // it("returns Hello World", function(done) {
        //     request.get(base_url, function(error, response, body) {
        //         //expect(body).toBe("Hello World");
        //         assert.equal("Hello World", body);
        //         helloWorld.closeServer();
        //         done();
        //     });
        // });
    });
});