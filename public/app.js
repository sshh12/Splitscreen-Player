//Login Dialog
BootstrapDialog.show({
    title: 'Login',
    message: 'Email: <input type="email" id="email" class="form-control"><br>Password: <input type="Password" id="password" class="form-control">',
    onhide: function(dialogRef) {
        email = dialogRef.getModalBody().find('#email').val();
        password = dialogRef.getModalBody().find('#password').val();
        if (email.length > 5 && password.length >= 6) {
            init(email, password);
            return true;
        }
        return false;
    },
    buttons: [{
        label: 'Go',
        action: function(dialogRef) {
            dialogRef.close();
        }
    }]
});

//For global access
var primaryID = 0;
var storage;
var db;

//Video Methods
var offsets = [0, 0, 0, 0, 0, 0];

function doToAll(func) {
    for (var i = 0; i < 6; i++) {
        var video = document.getElementById('vid' + i);
        func(video, i);
    }
}

function getCurrentTime() {
    return document.getElementById('vid' + primaryID).currentTime - offsets[primaryID];
}

function getCurrentSpeed() {
    return document.getElementById('vid' + primaryID).playbackRate;
}

function rotatePrimary() {
    var oldVid = document.getElementById('vid' + primaryID);
    primaryID = (primaryID + 1) % 6;
    var newVid = document.getElementById('vid' + primaryID);

    oldVid.muted = true;
    newVid.muted = false;
    document.getElementById('primary').innerHTML = primaryID;
}

function modifyOffset(value, id) {
    var vidID = id || primaryID;
    db.ref('offsets/' + vidID).set(value);
}

function resetOffsets() {
    BootstrapDialog.show({
        title: 'Reset',
        message: 'Are you sure???',
        onhide: function(dialogRef) {
            return true;
        },
        buttons: [{
            label: 'Yes',
            action: function(dialogRef) {
                for (var i = 0; i < 6; i++) {
                    modifyOffset(0, i);
                }
                dialogRef.close();
            }
        }, {
            label: 'No',
            action: function(dialogRef) {
                dialogRef.close();

            }
        }]
    });
}

//Init Firebase
function init(email, pass) {

    firebase.initializeApp(config);

    firebase.auth().signInWithEmailAndPassword(email, pass)

    db = firebase.database();

    doToAll(function(v, id) {
        var offsetRef = db.ref('offsets/' + id);
        offsetRef.on('value', function(content) {
            console.log('Updating Offset for ' + id);
            offsets[id] = content.val();
            v.currentTime = offsets[id];
        });
    })

    var ignore = true; //Ignore the first result to avoid auto pausing
    var cmdRef = db.ref('command');
    cmdRef.on('value', function(v) {
        if (!ignore) {

            var content = v.val();

            if (content.action === 'play') {
                doToAll(function(v) {
                    v.play();
                });
            } else if (content.action === 'pause') {
                doToAll(function(v) {
                    v.pause();
                });
            } else if (content.action === 'reset') {
                doToAll(function(v, id) {
                    v.pause();
                    v.currentTime = offsets[id];
                    v.playbackRate = 1;
                });
            } else if (content.action === 'set') {
                doToAll(function(v, id) {
                    v.currentTime = content.time + offsets[id];
                });
            } else if (content.action === 'speed') {
                doToAll(function(v) {
                    v.playbackRate = content.rate;
                });
            }

        } else {
            ignore = false;
        }
    });

    //Load Videos
    storage = firebase.storage();

    loadVideos();

}



function upload() {
    BootstrapDialog.show({
        title: 'Upload',
        message: 'ID (0-5): <input type="number" id="num" max=5 min=0 class="form-control"><br>File: <input type="file" id="file" class="form-control">',
        onhide: function(dialogRef) {
            id = dialogRef.getModalBody().find('#num').val();
            vidFile = dialogRef.getModalBody().find('#file').get(0).files[0];
            if (dialogRef.getModalBody().find('#file').val().length > 5) {

                document.getElementById('uploadbtn').innerHTML = 'Uploading...';
                document.getElementById('uploadbtn').onClick = '';
                document.getElementById('uploadbtn').className = 'btn btn-success';

                var videoRef = storage.refFromURL('gs://videoplayer-9311f.appspot.com/videos/video' + id + '.mp4');
                videoRef.put(vidFile).then(function(snapshot) {
                    document.getElementById('uploadbtn').innerHTML = 'Upload';
                    document.getElementById('uploadbtn').onClick = 'upload()';
                    document.getElementById('uploadbtn').className = 'btn btn-info';
                });

            }
            return true;
        },
        buttons: [{
            label: 'Upload',
            action: function(dialogRef) {
                dialogRef.close();
            }
        }]
    });
}

//Helper Funcs
function loadVideos() {
    doToAll(function(v, id) {
        var videoRef = storage.refFromURL('gs://videoplayer-9311f.appspot.com/videos/video' + id + '.mp4');
        videoRef.getDownloadURL().then(function(url) {
            console.log(id);
            console.log(url);
            v.src = url;
            v.currentTime = offsets[id];
            v.controls = false;
            if (id != primaryID) {
                v.muted = true;
            }
        });
    });
}

function send(content) {
    db.ref('command').set(content);
}