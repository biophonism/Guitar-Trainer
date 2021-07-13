const PAGE_FRET = 0
const PAGE_INTV = 1
const PAGE_DEGR = 2
const FRET_SIZE = 20
const NOTE_C = 0
const NOTE_D = 2
const NOTE_E = 4
const NOTE_F = 5
const NOTE_G = 7
const NOTE_A = 9
const NOTE_B = 11
const NOTE_CS = 1
const NOTE_DS = 3
const NOTE_FS = 6
const NOTE_GS = 8
const NOTE_AS = 10

// Load data from localStorage
var page = localStorage.page !== undefined ? parseInt(localStorage.page) : PAGE_FRET
changePage(page)
if (localStorage.fretSel !== undefined) document.getElementById("fretSel").value =
    localStorage.fretSel
if (localStorage.intvSel !== undefined) document.getElementById("intvSel").value =
    localStorage.intvSel

var shift = false
var backSlash = false
var fretboard = { string: -1, fret: -1, currentNote: -1, lastString: -1 }
var fretCanvas = document.getElementById("fretCanvas")
var fretReviews = []
nextNote(fretboard, fretCanvas, fretReviews)

var interval = { strA: -1, frtA: -1, strB: -1, frtB: -1 }
var intvCanvas = document.getElementById("intvCanvas")
nextInterval()

var degree = { string: -1, fret: -1, currentNote: -1, lastString: -1 }
var degrCanvas = document.getElementById("degrCanvas")
var degrReviews = []
nextNote(degree, degrCanvas, degrReviews)

// Events
document.querySelectorAll(".sideLink").forEach((e, i) => e.addEventListener("click",
    () => { changePage(i) }))
window.addEventListener("keydown", e => {
    if (e.code === "IntlBackslash") backSlash = true
    if (e.code === "ShiftLeft") shift = true
    switch (page) {
        case PAGE_FRET:
            switch (e.code) {
                case "KeyA":
                    if (shift) inputFretboard(NOTE_AS)
                    else inputFretboard(NOTE_A)
                    break
                case "KeyB":
                    if (shift) inputFretboard(NOTE_C)
                    else inputFretboard(NOTE_B)
                    break
                case "KeyC":
                    if (shift) inputFretboard(NOTE_CS)
                    else inputFretboard(NOTE_C)
                    break
                case "KeyD":
                    if (shift) inputFretboard(NOTE_DS)
                    else inputFretboard(NOTE_D)
                    break
                case "KeyE":
                    if (shift) inputFretboard(NOTE_F)
                    else inputFretboard(NOTE_E)
                    break
                case "KeyF":
                    if (shift) inputFretboard(NOTE_FS)
                    else inputFretboard(NOTE_F)
                    break
                case "KeyG":
                    if (shift) inputFretboard(NOTE_GS)
                    else inputFretboard(NOTE_G)
                    break
            }
            break
        case PAGE_INTV:
            switch (e.code) {
                case "Digit1": case "Numpad1": inputInterval(0)
                    break
                case "Digit2": case "Numpad2":
                    if (backSlash) inputInterval(1)
                    else if (shift) inputInterval(2)
                    break
                case "Digit3": case "Numpad3":
                    if (backSlash) inputInterval(3)
                    else if (shift) inputInterval(4)
                    break
                case "Digit4": case "Numpad4":
                    if (backSlash) inputInterval(4)
                    else if (shift) inputInterval(6)
                    else inputInterval(5)
                    break
                case "Digit5": case "Numpad5":
                    if (backSlash) inputInterval(6)
                    else if (shift) inputInterval(8)
                    else inputInterval(7)
                    break
                case "Digit6": case "Numpad6":
                    if (backSlash) inputInterval(8)
                    else if (shift) inputInterval(9)
                    break
                case "Digit7": case "Numpad7":
                    if (backSlash) inputInterval(10)
                    else if (shift) inputInterval(11)
                    break
            }
            break
        case PAGE_DEGR:
            switch (e.code) {
                case "Digit1": case "Numpad1":
                    if (shift) inputDegree(1)
                    else if (backSlash) inputDegree(11)
                    else inputDegree(0)
                    break
                case "Digit2": case "Numpad2":
                    if (shift) inputDegree(3)
                    else if (backSlash) inputDegree(1)
                    else inputDegree(2)
                    break
                case "Digit3": case "Numpad3":
                    if (shift) inputDegree(5)
                    else if (backSlash) inputDegree(3)
                    else inputDegree(4)
                    break
                case "Digit4": case "Numpad4":
                    if (shift) inputDegree(6)
                    else if (backSlash) inputDegree(4)
                    else inputDegree(5)
                    break
                case "Digit5": case "Numpad5":
                    if (shift) inputDegree(8)
                    else if (backSlash) inputDegree(6)
                    else inputDegree(7)
                    break
                case "Digit6": case "Numpad6":
                    if (shift) inputDegree(10)
                    else if (backSlash) inputDegree(8)
                    else inputDegree(9)
                    break
                case "Digit7": case "Numpad7":
                    if (shift) inputDegree(0)
                    else if (backSlash) inputDegree(10)
                    else inputDegree(11)
                    break
            }
    }
})
window.addEventListener("keyup", e => {
    if (e.code === "IntlBackslash") backSlash = false
    if (e.code === "ShiftLeft") shift = false
})
document.getElementById("fretSel").addEventListener("change",
    () => { localStorage.fretSel = document.getElementById("fretSel").value })
document.getElementById("intvSel").addEventListener("change",
    () => { localStorage.intvSel = document.getElementById("intvSel").value })

function changePage(p) {
    document.querySelectorAll(".sideLink").forEach(e => e.removeAttribute("data-selected"))
    document.querySelectorAll(".main").forEach(e => { if (e.id !== getPageId(p)) { } })
    let nextPageId = getPageId(p)
    let currentPageId = getPageId(page)
    document.getElementById(currentPageId).style.top = "-100px"
    document.getElementById(currentPageId).style.opacity = "0"
    document.getElementById(nextPageId + "Link").dataset.selected = ""
    document.getElementById(nextPageId).style.top = "0px"
    document.getElementById(nextPageId).style.opacity = "1"
    page = p
    localStorage.page = p
}

function getPageId(p) {
    switch (p) {
        case PAGE_FRET: return "fret"
        case PAGE_INTV: return "intv"
        case PAGE_DEGR: return "degr"
    }
}

function inputDegree(d) {
    let degrText = document.getElementById("degrText")
    if (getInterval(parseInt(document.getElementById("degrSel").value),
        degree.currentNote + 12) === d) {
        degrText.innerHTML = "Correct!"
        degrText.style.color = "green"
        nextNote(degree, degrCanvas, degrReviews)
    } else {
        degrText.innerHTML = "Whoops!"
        degrText.style.color = "red"
    }
}

function inputInterval(i) {
    let intvText = document.getElementById("intvText")
    if (i === getInterval(getNote(interval.strA, interval.frtA),
        getNote(interval.strB, interval.frtB))) {
        intvText.innerHTML = "Correct!"
        intvText.style.color = "green"
        nextInterval()
    } else {
        intvText.innerHTML = "Whoops!"
        intvText.style.color = "red"
    }
}

function getInterval(n1, n2) {
    return (Math.max(n1, n2) - Math.min(n1, n2)) % 12
}

function nextInterval() {
    interval.strA = Math.floor(Math.random() * 6)
    interval.frtA = Math.floor(Math.random() * 12)
    if (document.getElementById("intvSel").value == "same") {
        let frets = []
        for (let i = 0; i < 11; i++) frets.push(i)
        frets.splice(interval.frtA, 1)
        interval.frtB = frets[Math.floor(Math.random() * 11)]
        interval.strB = interval.strA
    } else {
        if (document.getElementById("intvSel").value == "near") {
            let min = Math.max(interval.frtA - 4, 0)
            interval.frtB = Math.min(11, min + Math.floor(Math.random()
                * (interval.frtA - min + 4)))
        } else interval.frtB = Math.floor(Math.random() * 11)
        let stringsB = [0, 1, 2, 3, 4, 5]
        stringsB.splice(interval.strA, 1)
        interval.strB = stringsB[Math.floor(Math.random() * 5)]
    }
    clear(intvCanvas)
    drawFretboard(intvCanvas, FRET_SIZE)
    drawNote(intvCanvas, interval.strA, interval.frtA, FRET_SIZE)
    drawNote(intvCanvas, interval.strB, interval.frtB, FRET_SIZE)
}

function inputFretboard(note) {
    let fretText = document.getElementById("fretText")
    if (note == fretboard.currentNote) {
        fretText.innerHTML = "Correct!"
        fretText.style.color = "green"
        nextNote(fretboard, fretCanvas, fretReviews)
    }
    else {
        fretText.innerHTML = "Whoops!"
        fretText.style.color = "red"
        fretReviews.push({ s: fretboard.string, f: fretboard.fret, i: 3, count: 5 })
    }
}

function nextNote(fb, canvas, reviews) {
    let review
    let rIndex = -1
    for (let i = 0; i < reviews.length; i++) {
        const r = reviews[i]
        if (r.i == 0) {
            review = r
            rIndex = i
        }
        else r.i--
    }
    if (review !== undefined) {
        fb.string = review.s
        fb.fret = review.f
        review.count--
        review.i = 3
    } else {
        let strings = [0, 1, 2, 3, 4, 5]
        if (fb.lastString != -1) strings.splice(fb.lastString, 1)
        fb.string = strings[Math.floor(Math.random() * strings.length)]
        switch (document.getElementById("fretSel").value) {
            case "firstFive":
                fb.fret = 1 + Math.floor(Math.random() * 5)
                break
            case "lastSix":
                fb.fret = 6 + Math.floor(Math.random() * 6)
                break
            case "oneEleven":
                fb.fret = 1 + Math.floor(Math.random() * 11)
                break
        }
    }
    if (rIndex !== -1 && review.count === 0) reviews.splice(rIndex)
    fb.lastString = fb.string
    fb.currentNote = getNote(fb.string, fb.fret) % 12
    clear(canvas)
    drawFretboard(canvas, FRET_SIZE)
    drawNote(canvas, fb.string, fb.fret, FRET_SIZE)
}

function getNoteName(n) {
    switch (n) {
        case NOTE_C: return "C"
        case NOTE_CS: return "C#"
        case NOTE_D: return "D"
        case NOTE_DS: return "D#"
        case NOTE_E: return "E"
        case NOTE_F: return "F"
        case NOTE_FS: return "F#"
        case NOTE_G: return "G"
        case NOTE_GS: return "G#"
        case NOTE_A: return "A"
        case NOTE_AS: return "A#"
        case NOTE_B: return "B"
    }
}

function getNote(s, f) {
    switch (s) {
        case 0:
            s = NOTE_E + 24
            break
        case 1:
            s = NOTE_B + 12
            break
        case 2:
            s = NOTE_G + 12
            break
        case 3:
            s = NOTE_D + 12
            break
        case 4:
            s = NOTE_A
            break
        case 5:
            s = NOTE_E
            break
    }
    return s + f
}

function drawFretboard(canvas, s) {
    let c = canvas.getContext("2d")
    c.save()
    let nut = s / 2
    let scaleWidth = s * 24
    c.translate(s, 0)
    c.fillStyle = "black"
    c.strokeStyle = "rgb(200, 200, 200)"
    c.fillRect(nut, 0, s * 24, s * 6)
    c.fillStyle = "rgb(200, 200, 200)"
    c.fillRect(0, 0, nut, s * 6)
    c.translate(nut, 0)
    c.lineWidth = s / 5
    for (let fret = 1; fret < 13; fret++) {
        c.beginPath()
        c.moveTo(fret * s * 2, 0)
        c.lineTo(fret * s * 2, s * 6)
        c.stroke()
        c.closePath()
    }
    c.fillStyle = "white"
    c.beginPath()
    c.ellipse(s * 5, s * 3, s / 3, s / 3, Math.PI / 4, 0, 2 * Math.PI)
    c.ellipse(s * 9, s * 3, s / 3, s / 3, Math.PI / 4, 0, 2 * Math.PI)
    c.ellipse(s * 13, s * 3, s / 3, s / 3, Math.PI / 4, 0, 2 * Math.PI)
    c.ellipse(s * 17, s * 3, s / 3, s / 3, Math.PI / 4, 0, 2 * Math.PI)
    c.fill()
    c.beginPath()
    c.ellipse(s * 23, s * 2, s / 3, s / 3, Math.PI / 4, 0, 2 * Math.PI)
    c.ellipse(s * 23, s * 4, s / 3, s / 3, Math.PI / 4, 0, 2 * Math.PI)
    c.fill()
    c.translate(0, s / 2)
    for (let str = 0; str < 6; str++) {
        c.lineWidth = (str + 1) / 2
        if (c.lineWidth < 1) c.lineWidth = 1
        c.beginPath()
        c.moveTo(0, str * s)
        c.lineTo(scaleWidth, str * s)
        c.stroke()
    }
    c.closePath()
    c.restore()
}

function drawNote(canvas, str, frt, s) {
    let c = canvas.getContext("2d")
    c.save()
    c.translate(s * 1.5, 0)
    c.beginPath()
    c.fillStyle = "red"
    let x = frt > 0 ? s * (frt * 2 - 1) : -s
    c.ellipse(x, s / 2 + s * str, s / 2, s / 2, Math.PI / 4, 0, 2 * Math.PI)
    c.fill()
    c.restore()
}

function clear(canvas) {
    let c = canvas.getContext("2d")
    c.clearRect(0, 0, canvas.width, canvas.height)
}
