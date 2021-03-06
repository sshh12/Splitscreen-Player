# Splitscreen Viewer

An HTML/JS based Media Player with the abilty to show 6 different videos synced across multiple devices.

[Live Code](https://videoplayer-9311f.firebaseapp.com/)

## Built Using:
* [Firebase](https://firebase.google.com/)
* [Bootstrap](http://getbootstrap.com/)
* [Bootstrap3-dialog](https://github.com/nakupanda/bootstrap3-dialog)

---

## Setup

#### Realtime Database
```
videoplayer
|
|--- command
|      |
|      |- action: "pause"
|
|--- offsets
       |
       |- 0: 0.0
       |
       |- 1: 0.0
       |
       |- 2: 0.0
       |
       |- 3: 0.0
       |
       |- 4: 0.0
       |
       |- 5: 0.0
```

#### Storage
```
videos/
	video0.mp4
	video1.mp4
	video2.mp4
	video3.mp4
	video4.mp4
	video5.mp4
```

---

## Screenshot

![screenshot 1](https://cloud.githubusercontent.com/assets/6625384/22629722/6aaf0f06-ebb1-11e6-993f-ef71bfa0e9c9.jpg)
