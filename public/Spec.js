"use strict";
var env = jasmine.getEnv();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Task', function () {

    var token;
    var socket;

    axios({
        method: 'post',
        url: "http://localhost:8080/api/user/validate",
        data: { email: "A@a.com", password: "Oooooo5!" },
    })
        .then(function (response) {
            console.log(response);
            //localStorage.currentUser = JSON.stringify(response.data);
            token = response.data.token;
            socket = io.connect('http://localhost:8080');

            console.log(socket);
            console.log("sending: " + token);
            socket.emit('authenticate', { token });
            socket.on('authenticated', () => {console.log("auth");})
        })
        .catch((error) => {

            console.log('Error: ', error.message);

        });


    beforeEach(function () {

    });

    it('sockets are working', function (done) {
        let code = 0;
        sleep(1500).then(()=>{
            socket.emit('createRoom', "d", (partyCode) => {code=partyCode});
            sleep(300).then(()=>{
                console.log(code);
                env.expect(code>0).toBeTruthy();
                done();
    
    
            })


        })
        
    });




});


