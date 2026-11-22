function startJourney() {
    // Reset stamps for a new journey
    for (let i = 1; i <= 4; i++) {
        localStorage.removeItem("stamp-" + i + "-earned");
        localStorage.removeItem("stamp-" + i + "-time");
    }

    restoreStamps();

    showPage("passport-page");
}

let completedStations = [];
function resetStamps() {
    for (let i = 1; i <= 4; i++) {
        localStorage.removeItem("stamp-" + i + "-earned");
    }
}
function updatePassportProgress() {
    let count = 0;

    for (let i = 1; i <= 4; i++) {
        if (localStorage.getItem("stamp-" + i + "-earned") === "true") {
            count++;
        }
    }

    document.getElementById("passport-progress").textContent =
        count + " / 4 STAMPS COLLECTED";
}

function showPage(pageId) {
    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");
}


// PHOTO UPLOAD PREVIEW

const photoUpload = document.getElementById("photo-upload");

photoUpload.addEventListener("change", function() {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const preview = document.getElementById("photo-preview");
            const placeholder = document.getElementById("photo-placeholder");

            preview.src = event.target.result;
            preview.style.display = "block";
            placeholder.style.display = "none";
        };

        reader.readAsDataURL(file);
    }
});



function submitActivity() {
    const stationText = document.getElementById("activity-station-number").textContent;
    const stationNumber = Number(stationText.replace("STATION", "").trim());

    const feedback = document.getElementById("activity-feedback");

    // STATION 4 - REFLECTION
    if (stationNumber === 4) {
        const reflection = document.querySelector(".reflection-answer");

        if (!reflection || reflection.value.trim() === "") {
            alert("Please write your reflection first!");
            return;
        }

        markStampEarned(4);
        sendCompletionRecord(
    document.getElementById("passenger-name").value.trim(),
    "Motility Memoirs"
);
        feedback.textContent =
            "Reflection submitted! Thank you for sharing your thoughts, Explorer! Stamp 4 collected!";
        return;
    }

    let answers;
    let score = 0;
    let unanswered = 0;

    if (stationNumber === 1) {
        answers = document.querySelectorAll(".scramble-answer");
    } else if (stationNumber === 2) {
        answers = document.querySelectorAll(".identification-answer");
    } else if (stationNumber === 3) {
        answers = document.querySelectorAll(".matching-answer");
    } else {
        alert("Invalid station!");
        return;
    }

    if (!answers || answers.length === 0) {
        alert("No questions found!");
        return;
    }

    answers.forEach(function(input) {
        const userAnswer = input.value.trim().toUpperCase();
        const correctAnswer = input.dataset.answer.toUpperCase();

        if (userAnswer === "") {
            unanswered++;
        } else if (userAnswer === correctAnswer) {
            score++;
        }
    });

    if (unanswered > 0) {
        alert("Please answer all five questions first!");
        return;
    }

    markStampEarned(stationNumber);
    const stationNames = {
    1: "Actin Avenue",
    2: "Microtubule Mission",
    3: "Filament Connection"
};

function sendCompletionRecord(name, station, score) {
    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify({
            name: name,
            station: station,
            score: score
        })
    }

    feedback.textContent =
        "You got " + score + " out of 5 correct! Great job, Explorer! Stamp " +
        stationNumber + " collected!";
}

function createPassport() {

    const name = document.getElementById("passenger-name").value.trim();
    const studentNumber = document.getElementById("student-number").value.trim();
    const birthday = document.getElementById("birthday").value;
    const issueDate = document.getElementById("issue-date").value;

    // Check if the required details are complete
    if (!name || !studentNumber || !birthday || !issueDate) {
        alert("Please complete all passport information first!");
        return;
    }

    // Display the explorer's name on the boarding pass
    document.getElementById("live-passport-name").textContent = name.toUpperCase();
    document.getElementById("boarding-name").textContent = name.toUpperCase();
    // Proceed to the boarding pass
    showPage("boarding-page");
}
 function enterStations(){
    showPage("stations-page");
 }
 
function openStation(stationNumber) {
    showPage("activity-page");

    const stationNumberText = document.getElementById("activity-station-number");
    const title = document.getElementById("activity-title");
    const subtitle = document.getElementById("activity-subtitle");
    const instructions = document.getElementById("activity-instructions-text");
    const content = document.getElementById("activity-content");
    const feedback = document.getElementById("activity-feedback");

    stationNumberText.textContent = "STATION " + stationNumber;
    feedback.textContent = "";

    // STATION 1 - ACTIN AVENUE
    if (stationNumber === 1) {
        title.textContent = "THE GREAT WORD SCRAMBLE";
        subtitle.textContent = "ACTIN AVENUE";
        instructions.textContent =
            "Unscramble the letters to reveal five words related to the cytoskeleton and actin. Type your answers in the boxes.";

        const words = [
            { scramble: "TINAC", hint: "A protein that forms microfilaments.", answer: "ACTIN" },
            { scramble: "OYSMNI", hint: "A motor protein that interacts with actin.", answer: "MYOSIN" },
            { scramble: "MIFROCLAMIENT", hint: "The thin filaments made of actin.", answer: "MICROFILAMENT" },
            { scramble: "DOPUSAPOIED", hint: "Cell extensions used for movement.", answer: "PSEUDOPODIA" },
            { scramble: "KETOYSCENLOT", hint: "A network that helps support the cell.", answer: "CYTOSKELETON" }
        ];

        content.innerHTML = words.map((word, index) => `
            <div class="scramble-item">
                <h3>WORD ${index + 1}</h3>
                <p class="scrambled-word">${word.scramble}</p>
                <p>${word.hint}</p>
                <input type="text" class="scramble-answer"
                    data-answer="${word.answer}"
                    placeholder="Type your answer here">
            </div>
        `).join("");
    }

    // STATION 2 - MICROTUBULE MISSION
    else if (stationNumber === 2) {
        title.textContent = "NAME THAT STRUCTURE!";
        subtitle.textContent = "MICROTUBULE MISSION";
        instructions.textContent =
            "Read each description carefully and identify the correct cytoskeleton structure or protein. Write your answer in the box.";

        const questions = [
            { question: "1. What are the hollow, tube-shaped structures made of tubulin?", answer: "MICROTUBULES" },
            { question: "2. What is the protein subunit that makes up microtubules?", answer: "TUBULIN" },
            { question: "3. What motor protein generally moves cargo toward the plus end of microtubules?", answer: "KINESIN" },
            { question: "4. What motor protein generally moves cargo toward the minus end of microtubules?", answer: "DYNEIN" },
            { question: "5. What cell structure helps organize microtubules in animal cells?", answer: "CENTROSOME" }
        ];

        content.innerHTML = questions.map((item, index) => `
            <div class="scramble-item">
                <h3>QUESTION ${index + 1}</h3>
                <p>${item.question}</p>
                <input type="text" class="identification-answer"
                    data-answer="${item.answer}"
                    placeholder="Type your answer here">
            </div>
        `).join("");
    }

    // STATION 3 - FILAMENT CONNECTION
    else if (stationNumber === 3) {
        title.textContent = "THE MATCHING CHALLENGE";
        subtitle.textContent = "FILAMENT CONNECTION";
        instructions.textContent =
            "Match each term in Column A with its correct description in Column B. Choose your answer from the dropdown.";

        const pairs = [
            { term: "1. Actin", answer: "Microfilaments" },
            { term: "2. Tubulin", answer: "Microtubules" },
            { term: "3. Keratin", answer: "Intermediate filaments" },
            { term: "4. Kinesin", answer: "Motor protein moving toward plus end" },
            { term: "5. Dynein", answer: "Motor protein moving toward minus end" }
        ];

        const choices = [
            "Microfilaments",
            "Microtubules",
            "Intermediate filaments",
            "Motor protein moving toward plus end",
            "Motor protein moving toward minus end"
        ];

        content.innerHTML = pairs.map((pair, index) => `
            <div class="scramble-item">
                <h3>${pair.term}</h3>
                <select class="matching-answer" data-answer="${pair.answer}">
                    <option value="">Choose your answer</option>
                    ${choices.map(choice => `
                        <option value="${choice}">${choice}</option>
                    `).join("")}
                </select>
            </div>
        `).join("");
    }

    // STATION 4 - MOTILITY MEMOIRS
    else if (stationNumber === 4) {
        title.textContent = "A TRAVELER'S REFLECTION";
        subtitle.textContent = "MOTILITY MEMOIRS";
        instructions.textContent =
            "Reflect on what you have learned about the cytoskeleton. Answer the question using your own words.";

        content.innerHTML = `
            <div class="scramble-item">
                <h3>YOUR REFLECTION</h3>
                <p>
                    After exploring the four stations, why do you think
                    the cytoskeleton is important to the cell?
                    How do its different components help the cell
                    maintain its shape, move, and transport materials?
                </p>
                <textarea class="reflection-answer"
                    rows="7"
                    placeholder="Write your reflection here..."></textarea>
            </div>
        `;
    }
}

function markStampEarned(number) {
    localStorage.setItem("stamp-" + number + "-earned", "true");

    const completedAt = new Date().toLocaleString();
    localStorage.setItem("stamp-" + number + "-time", completedAt);

    restoreStamps();
}

function restoreStamps() {
    let earnedCount = 0;

    for (let i = 1; i <= 4; i++) {
        const earned =
            localStorage.getItem("stamp-" + i + "-earned") === "true";

        const progressStamp = document.getElementById("progress-stamp-" + i);
        const finalStamp = document.getElementById("stamp-" + i);

        if (progressStamp) {
            progressStamp.classList.toggle("earned", earned);
        }

        if (finalStamp) {
            finalStamp.style.display = earned ? "block" : "none";
        }

        if (earned) {
            earnedCount++;
        }
    }

    const progress = document.getElementById("passport-progress");

    if (progress) {
        progress.textContent = earnedCount + " / 4 STAMPS COLLECTED";
    }
    const proceedButton = document.getElementById("proceed-button");

if (proceedButton) {
    proceedButton.style.display =
        earnedCount === 4 ? "inline-block" : "none";
}
    return earnedCount;
}
function showPassport() {
    const name = document.getElementById("passenger-name").value.trim();
    const studentNumber = document.getElementById("student-number").value.trim();
    const birthday = document.getElementById("birthday").value;
    const issueDate = document.getElementById("issue-date").value;
    const photoPreview = document.getElementById("photo-preview");
    const finalPhoto = document.getElementById("final-photo");

    document.getElementById("final-name").textContent = name ? name.toUpperCase() : "EXPLORER";
    document.getElementById("final-student-number").textContent = studentNumber || "---";
    document.getElementById("final-birthday").textContent = birthday || "---";
    document.getElementById("final-issue-date").textContent = issueDate || "---";

    if (finalPhoto && photoPreview && photoPreview.src) {
        finalPhoto.src = photoPreview.src;
    }

    restoreStamps();
    showPage("completed-passport-page");
}

function downloadPassport() {
    window.print();
}

restoreStamps();
// Show the explorer's name
const passengerName = document.getElementById("passenger-name");

if (passengerName) {
    document.getElementById("live-passport-name").textContent =
        passengerName.value || "YOUR NAME";
}

function clearOldStampRecords() {
    for (let i = 1; i <= 4; i++) {
        localStorage.removeItem("stamp-" + i + "-earned");
        localStorage.removeItem("stamp-" + i + "-time");
    }

    restoreStamps();
}
function proceedToFinish() {
    if (restoreStamps() !== 4) {
        alert("Please complete all four stations first!");
        return;
    }

    showPassport();
    showPage("finish-page");
}

async function downloadPassportJPG() {
    const passport = document.getElementById("final-passport");

    const canvas = await html2canvas(passport, {
        scale: 2,
        backgroundColor: "#103D2E"
    });

    const link = document.createElement("a");
    link.download = "CYTOQUEST-PASSPORT.jpg";
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    link.click();
}

async function downloadPassportPDF() {
    const passport = document.getElementById("final-passport");

    const canvas = await html2canvas(passport, {
        scale: 2,
        backgroundColor: "#103D2E"
    });

    const image = canvas.toDataURL("image/jpeg", 0.95);
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });

    const width = 277;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(image, "JPEG", 10, 10, width, height);
    pdf.save("CYTOQUEST-PASSPORT.pdf");
}

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyRBV_ViLBuGQyjZe3SDZwOkXhyDel5Aclns711Sbh3XrnlfsiTSwIwbFnY_vHh8DgyRQ/exec";

function sendCompletionRecord(name, station) {
    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify({
            name: name,
            station: station
        })
    });
}
